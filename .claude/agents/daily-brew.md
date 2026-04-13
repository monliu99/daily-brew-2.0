---
name: daily-brew
description: Use this agent for any work on the Daily Brew 2.0 project — adding features, debugging, modifying the recommendation engine, UI changes, or understanding how any part of the app works.
---

# Daily Brew 2.0 — Project Agent

## What This Project Is

Daily Brew is a browser-only single-page application (no backend) that recommends personalized coffee/tea drinks based on the user's mood, location, weather, and time of day. It runs entirely in the browser — all logic lives in `app.js`.

**Deployed on Vercel** — auto-deploys on every push to `main` branch of `monliu99/daily-brew-2.0` on GitHub. No build step needed; Vercel detects it as a static site.

**Local dev:** `python3 -m http.server 8080` from the project folder → open `http://localhost:8080`. Must use a server (not `file://`) due to CORS restrictions.

## File Structure

```
/
├── app.js              # All application logic (~1130 lines)
├── index.html          # Single-page HTML template (form + result display)
├── styles.css          # Coffee-themed responsive design
├── .gitignore          # Excludes .env, .DS_Store, node_modules
├── coffee-beans.png    # Brand icon
└── data/
    ├── brew_data.csv           # 1000 training records for ML fallback model
    └── generate_dataset.js     # Script to regenerate synthetic training data
```

## Architecture

### Recommendation Flow (Hybrid)
```
User submits form
    → getAIRecommendation() — calls Cloudflare Worker → Anthropic API
        → on success: returns Claude-generated drink
        → on failure: falls back to ML softmax classifier
            → predictProfile() on trained model
                → on model not ready: uses "fallback" profile → "House blend"
```

### Anthropic API Integration
- **Cloudflare Worker:** `https://daily-brew-api.moliu0709.workers.dev` (CORS proxy — required because Anthropic's API doesn't support browser CORS)
- **Model:** `claude-haiku-4-5-20251001` (Claude Haiku 4.5 — confirmed working with user's `sk-ant-api03-` key)
- **Auth:** User's own `sk-ant-api03-` key stored in `localStorage` under key `brew_api_key`
- **Browser sends to Worker:** `x-api-key` and `content-type` only — do NOT add `anthropic-version` here (causes CORS preflight failure)
- **Worker adds when forwarding to Anthropic:** `anthropic-version: 2023-06-01`
- **Response format:** Standard Anthropic message response — text extracted from `data.content[0].text`, then JSON-parsed for `{ name, description, recipe, why }`

### Why the Cloudflare Worker is needed
Anthropic's API does not support browser CORS. Direct `fetch()` calls from the browser to `api.anthropic.com` always fail with "Failed to fetch". The Worker acts as a proxy that handles CORS and adds the required `anthropic-version` header.

### Worker Code (for reference if Worker needs to be recreated)
```javascript
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "content-type, x-api-key"
        }
      });
    }
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "Missing API key" } }), {
        status: 401,
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    const body = await request.text();
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body
    });
    const responseText = await anthropicResponse.text();
    return new Response(responseText, {
      status: anthropicResponse.status,
      headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};
```

### ML Fallback Model
- **Algorithm:** Softmax classifier (multiclass logistic regression from scratch)
- **Training data:** `data/brew_data.csv` (1000 records, loaded async at startup)
- **Features (39 dimensions):**
  - 15 mood binary flags
  - 3 time-segment flags (morning/afternoon/evening)
  - 10 weather condition flags
  - 4 temperature bucket flags (cold/cool/mild/warm)
  - 6 region flags (derived from city time zone)
  - 1 bias term
- **Output classes (profile IDs):** `house_blend`, `espresso_smooth`, `tea_floral`, `matcha_creamy`, `cold_brew_refresh`, `sparkling_citrus`, `cacao_comfort`
- **State flags:** `modelReady` (bool), `model` (weights object), `profileLookup` (Map)

## Key Functions in app.js

| Function | Lines (approx) | Purpose |
|---|---|---|
| `getAIRecommendation()` | 281–350 | Calls Cloudflare Worker → Anthropic, parses JSON response |
| `buildFeatureVector()` | 352–390 | Builds 39-dim feature vector from form inputs |
| `trainSoftmax()` | 420–480 | Trains ML model (60 epochs, lr=0.05) |
| `predictProfile()` | 482–510 | Runs inference, returns profile ID string |
| `loadModel()` | 510–525 | Fetches CSV, trains model, sets `modelReady` |
| `recommendDrink()` | 675–727 | Hybrid engine: tries AI, falls back to ML |
| `saveApiKey()` | 262–269 | Trims + stores key in localStorage |
| `saveSettings()` | 1069–1115 | Validates key against Anthropic BEFORE saving |
| `buildCityList()` | ~775 | Populates city autocomplete (140+ US cities) |
| `updateMoment()` | ~820 | Updates time/weather display |

## Constants and Configuration

```javascript
const API_KEY_STORAGE_KEY = "brew_api_key";
const WORKER_URL = "https://daily-brew-api.moliu0709.workers.dev";
const MODEL = "claude-haiku-4-5-20251001";

// ML training hyperparameters
const MODEL_EPOCHS = 60;
const MODEL_LEARNING_RATE = 0.05;

// Mood options (15 total)
const moodKeys = ["angry","anxious","bored","calm","curious","gloomy","happy",
                  "hopeful","lonely","motivated","numb","restless","sad","stressed","tired"];

// Time segments
const timeSegments = ["morning","afternoon","evening"]; // 5–12, 12–17, 17+

// Temperature buckets (°F)
// cold <40, cool 40–59, mild 60–74, warm 75+
```

## Data Flow for a Brew Request

1. User selects up to 3 moods, a city, and weather is auto-fetched from Open-Meteo
2. `recommendDrink()` is called with `{ moods, weather, tempValue, timeSegment, location }`
3. If `hasApiKey()` → `getAIRecommendation()` is called
4. Claude receives a prompt like: *"I'm feeling calm, curious. It's morning in New Haven, CT, clear and 58°F. Suggest ONE coffee or tea drink..."*
5. Claude returns JSON with `{ name, description, recipe: [...], why }`
6. Result is displayed with animated step-by-step recipe and collapsible "why" section

## UI Sections (index.html)

- **Mood picker:** 15 toggle buttons, max 3 selectable
- **Location autocomplete:** City name input with keyboard nav dropdown
- **Weather display:** Auto-fetched or manual — shows condition + temperature
- **Settings modal:** API key entry field with live validation (gear icon in footer)
- **Result section:** Drink title, description, animated recipe steps, collapsible "why"
- **Spinner:** `#result-loading` — shown during API call, hidden otherwise. CSS uses `display: flex` so must use `[hidden]` selector override to hide it correctly

## Weather

- Source: Open-Meteo API (free, no auth required)
- Returns temperature in °F (imperial mode)
- Stored in `latestWeather = { condition, tempValue, tempDisplay }`
- Default fallback if fetch fails: 65°F, "clear"

## Known History and Decisions

- **Cloudflare Worker is required** — Anthropic's API doesn't support browser CORS. Direct calls always fail with "Failed to fetch". The Worker handles CORS and adds `anthropic-version`.
- **Do NOT add `anthropic-version` to browser→Worker requests** — it causes CORS preflight to fail because the Worker only allows `content-type` and `x-api-key` in its preflight response.
- **Model is `claude-haiku-4-5-20251001`** — user's `sk-ant-api03-` key only has access to Claude 4.x generation models. Older models (`claude-3-5-haiku-20241022`, `claude-3-haiku-20240307`) return "not_found_error".
- **Save-before-validate bug was fixed:** `saveApiKey()` is now only called after Anthropic returns a successful validation response, so invalid keys are never persisted.
- **Spinner CSS bug was fixed:** `.result__loading` uses `display: flex` which overrides the `hidden` HTML attribute. Fixed with `.result__loading[hidden] { display: none; }` in styles.css.
- Multiple provider options (Yale LLM Router, etc.) were tried and removed — Claude Haiku via Cloudflare Worker is the final approach.

## Common Tasks

### Add a new mood option
1. Add the mood string to `moodKeys` array (~line 65)
2. Add a display label to `moodLabels` object (~line 80)
3. No changes to ML features needed — the feature vector is built dynamically from `moodKeys`

### Add a new drink profile (ML fallback)
1. Add a new profile entry to `profileLookup` in `loadModel()` (~line 515)
2. Add sample rows to `data/brew_data.csv` with the new `profile_id`
3. The model will train on it automatically

### Change the Claude model
1. Update `MODEL` constant at line 184
2. To check which models are available to the user's key: `curl https://api.anthropic.com/v1/models -H "x-api-key: KEY" -H "anthropic-version: 2023-06-01"`

### Debug a failed API call
- "Failed to fetch" → CORS issue; check the Worker is deployed and `anthropic-version` is NOT being sent from the browser
- "Invalid API key" → key is wrong or expired; test directly with curl
- "not_found_error: model" → model not available for this key type; check available models via the models endpoint
- 429 → rate limited
