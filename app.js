const form = document.getElementById("brew-form");
const moodPicker = document.getElementById("mood-picker");
const moodHint = document.getElementById("mood-hint");
const locationInput = document.getElementById("location");
const cityListEl = document.getElementById("city-list");
const result = document.getElementById("result");
const title = result.querySelector(".result__title");
const description = result.querySelector(".result__description");
const details = document.getElementById("details");
const momentEl = document.getElementById("local-time");
const weatherEl = document.getElementById("weather");

const WEATHER_UNITS = "imperial";
const TEMP_UNIT = WEATHER_UNITS === "metric" ? "C" : "F";


const DATASET_URLS = ["data/brew_data.csv", "./data/brew_data.csv", "/data/brew_data.csv"];
const MODEL_EPOCHS = 60;
const MODEL_LEARNING_RATE = 0.05;

const cityList = [
  { name: "New York", state: "NY", lat: 40.7128, lon: -74.006, timeZone: "America/New_York" },
  { name: "Los Angeles", state: "CA", lat: 34.0522, lon: -118.2437, timeZone: "America/Los_Angeles" },
  { name: "Chicago", state: "IL", lat: 41.8781, lon: -87.6298, timeZone: "America/Chicago" },
  { name: "Houston", state: "TX", lat: 29.7604, lon: -95.3698, timeZone: "America/Chicago" },
  { name: "Phoenix", state: "AZ", lat: 33.4484, lon: -112.074, timeZone: "America/Phoenix" },
  { name: "Philadelphia", state: "PA", lat: 39.9526, lon: -75.1652, timeZone: "America/New_York" },
  { name: "San Antonio", state: "TX", lat: 29.4241, lon: -98.4936, timeZone: "America/Chicago" },
  { name: "San Diego", state: "CA", lat: 32.7157, lon: -117.1611, timeZone: "America/Los_Angeles" },
  { name: "Dallas", state: "TX", lat: 32.7767, lon: -96.797, timeZone: "America/Chicago" },
  { name: "San Jose", state: "CA", lat: 37.3382, lon: -121.8863, timeZone: "America/Los_Angeles" },
  { name: "Austin", state: "TX", lat: 30.2672, lon: -97.7431, timeZone: "America/Chicago" },
  { name: "Jacksonville", state: "FL", lat: 30.3322, lon: -81.6557, timeZone: "America/New_York" },
  { name: "Fort Worth", state: "TX", lat: 32.7555, lon: -97.3308, timeZone: "America/Chicago" },
  { name: "Columbus", state: "OH", lat: 39.9612, lon: -82.9988, timeZone: "America/New_York" },
  { name: "Charlotte", state: "NC", lat: 35.2271, lon: -80.8431, timeZone: "America/New_York" },
  { name: "San Francisco", state: "CA", lat: 37.7749, lon: -122.4194, timeZone: "America/Los_Angeles" },
  { name: "Indianapolis", state: "IN", lat: 39.7684, lon: -86.1581, timeZone: "America/Indiana/Indianapolis" },
  { name: "Seattle", state: "WA", lat: 47.6062, lon: -122.3321, timeZone: "America/Los_Angeles" },
  { name: "Denver", state: "CO", lat: 39.7392, lon: -104.9903, timeZone: "America/Denver" },
  { name: "Washington", state: "DC", lat: 38.9072, lon: -77.0369, timeZone: "America/New_York" },
  { name: "Boston", state: "MA", lat: 42.3601, lon: -71.0589, timeZone: "America/New_York" },
  { name: "El Paso", state: "TX", lat: 31.7619, lon: -106.485, timeZone: "America/Denver" },
  { name: "Nashville", state: "TN", lat: 36.1627, lon: -86.7816, timeZone: "America/Chicago" },
  { name: "Detroit", state: "MI", lat: 42.3314, lon: -83.0458, timeZone: "America/Detroit" },
  { name: "Portland", state: "OR", lat: 45.5152, lon: -122.6784, timeZone: "America/Los_Angeles" },
  { name: "Memphis", state: "TN", lat: 35.1495, lon: -90.049, timeZone: "America/Chicago" },
  { name: "Oklahoma City", state: "OK", lat: 35.4676, lon: -97.5164, timeZone: "America/Chicago" },
  { name: "Las Vegas", state: "NV", lat: 36.1699, lon: -115.1398, timeZone: "America/Los_Angeles" },
  { name: "Louisville", state: "KY", lat: 38.2527, lon: -85.7585, timeZone: "America/New_York" },
  { name: "Baltimore", state: "MD", lat: 39.2904, lon: -76.6122, timeZone: "America/New_York" },
  { name: "Milwaukee", state: "WI", lat: 43.0389, lon: -87.9065, timeZone: "America/Chicago" },
  { name: "Albuquerque", state: "NM", lat: 35.0844, lon: -106.6504, timeZone: "America/Denver" },
  { name: "Tucson", state: "AZ", lat: 32.2226, lon: -110.9747, timeZone: "America/Phoenix" },
  { name: "Fresno", state: "CA", lat: 36.7378, lon: -119.7871, timeZone: "America/Los_Angeles" },
  { name: "Mesa", state: "AZ", lat: 33.4152, lon: -111.8315, timeZone: "America/Phoenix" },
  { name: "Sacramento", state: "CA", lat: 38.5816, lon: -121.4944, timeZone: "America/Los_Angeles" },
  { name: "Atlanta", state: "GA", lat: 33.749, lon: -84.388, timeZone: "America/New_York" },
  { name: "Kansas City", state: "MO", lat: 39.0997, lon: -94.5786, timeZone: "America/Chicago" },
  { name: "Colorado Springs", state: "CO", lat: 38.8339, lon: -104.8214, timeZone: "America/Denver" },
  { name: "Miami", state: "FL", lat: 25.7617, lon: -80.1918, timeZone: "America/New_York" },
  { name: "Raleigh", state: "NC", lat: 35.7796, lon: -78.6382, timeZone: "America/New_York" },
  { name: "Omaha", state: "NE", lat: 41.2565, lon: -95.9345, timeZone: "America/Chicago" },
  { name: "Oakland", state: "CA", lat: 37.8044, lon: -122.2711, timeZone: "America/Los_Angeles" },
  { name: "Minneapolis", state: "MN", lat: 44.9778, lon: -93.265, timeZone: "America/Chicago" },
  { name: "Tulsa", state: "OK", lat: 36.1539, lon: -95.9928, timeZone: "America/Chicago" },
  { name: "Cleveland", state: "OH", lat: 41.4993, lon: -81.6944, timeZone: "America/New_York" },
  { name: "Wichita", state: "KS", lat: 37.6872, lon: -97.3301, timeZone: "America/Chicago" },
  { name: "Arlington", state: "TX", lat: 32.7357, lon: -97.1081, timeZone: "America/Chicago" },
  { name: "New Orleans", state: "LA", lat: 29.9511, lon: -90.0715, timeZone: "America/Chicago" },
  { name: "Bakersfield", state: "CA", lat: 35.3733, lon: -119.0187, timeZone: "America/Los_Angeles" },
  { name: "Tampa", state: "FL", lat: 27.9506, lon: -82.4572, timeZone: "America/New_York" },
  { name: "Honolulu", state: "HI", lat: 21.3069, lon: -157.8583, timeZone: "Pacific/Honolulu" },
  { name: "Anaheim", state: "CA", lat: 33.8366, lon: -117.9143, timeZone: "America/Los_Angeles" },
  { name: "Santa Ana", state: "CA", lat: 33.7455, lon: -117.8677, timeZone: "America/Los_Angeles" },
  { name: "Aurora", state: "CO", lat: 39.7294, lon: -104.8319, timeZone: "America/Denver" },
  { name: "St. Louis", state: "MO", lat: 38.627, lon: -90.1994, timeZone: "America/Chicago" },
  { name: "Riverside", state: "CA", lat: 33.9806, lon: -117.3755, timeZone: "America/Los_Angeles" },
  { name: "Corpus Christi", state: "TX", lat: 27.8006, lon: -97.3964, timeZone: "America/Chicago" },
  { name: "Lexington", state: "KY", lat: 38.0406, lon: -84.5037, timeZone: "America/New_York" },
  { name: "Stockton", state: "CA", lat: 37.9577, lon: -121.2908, timeZone: "America/Los_Angeles" },
  { name: "Pittsburgh", state: "PA", lat: 40.4406, lon: -79.9959, timeZone: "America/New_York" },
  { name: "Cincinnati", state: "OH", lat: 39.1031, lon: -84.512, timeZone: "America/New_York" },
  { name: "St. Paul", state: "MN", lat: 44.9537, lon: -93.09, timeZone: "America/Chicago" },
  { name: "Anchorage", state: "AK", lat: 61.2181, lon: -149.9003, timeZone: "America/Anchorage" },
  { name: "Greensboro", state: "NC", lat: 36.0726, lon: -79.792, timeZone: "America/New_York" },
  { name: "Plano", state: "TX", lat: 33.0198, lon: -96.6989, timeZone: "America/Chicago" },
  { name: "Lincoln", state: "NE", lat: 40.8136, lon: -96.7026, timeZone: "America/Chicago" },
  { name: "Orlando", state: "FL", lat: 28.5383, lon: -81.3792, timeZone: "America/New_York" },
  { name: "Irvine", state: "CA", lat: 33.6846, lon: -117.8265, timeZone: "America/Los_Angeles" },
  { name: "Newark", state: "NJ", lat: 40.7357, lon: -74.1724, timeZone: "America/New_York" },
  { name: "Toledo", state: "OH", lat: 41.6528, lon: -83.5379, timeZone: "America/New_York" },
  { name: "Durham", state: "NC", lat: 35.994, lon: -78.8986, timeZone: "America/New_York" },
  { name: "Chula Vista", state: "CA", lat: 32.6401, lon: -117.0842, timeZone: "America/Los_Angeles" },
  { name: "Fort Wayne", state: "IN", lat: 41.0793, lon: -85.1394, timeZone: "America/Indiana/Indianapolis" },
];

const cityIndex = new Map();
let selectedCity = null;
const moodLabels = {
  happy: "Happy",
  tired: "Tired",
  stressed: "Stressed",
  sad: "Sad",
  angry: "Angry",
  anxious: "Anxious",
  bored: "Bored",
  calm: "Calm",
  lonely: "Lonely",
  restless: "Restless",
  gloomy: "Gloomy",
  motivated: "Motivated",
  curious: "Curious",
  numb: "Numb",
  hopeful: "Hopeful",
};

const moodKeys = Object.keys(moodLabels);
const timeSegments = ["morning", "afternoon", "evening"];
const weatherKeys = [
  "clear",
  "mostly clear",
  "overcast",
  "fog",
  "drizzle",
  "rain",
  "snow",
  "showers",
  "thunderstorm",
  "mixed conditions",
];
const tempBuckets = ["cold", "cool", "mild", "warm"];
const regionKeys = ["eastern", "central", "mountain", "pacific", "alaska", "hawaii"];

const selectedMoods = new Set();
let latestWeather = null;
let modelReady = false;
let model = null;
let profileLookup = new Map();

function updateMoodHint(customHint) {
  const baseHint = customHint || (selectedMoods.size >= 3 ? "Mood limit reached (3)." : "Select up to 3 moods.");
  moodHint.textContent = baseHint;
}

function getTimeSegment(timeZone) {
  const hour = getHourInTimeZone(timeZone);
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  return "evening";
}

function getHourInTimeZone(timeZone) {
  if (!timeZone) {
    return new Date().getHours();
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone,
  }).formatToParts(new Date());
  const hourPart = parts.find((part) => part.type === "hour");
  return Number(hourPart?.value ?? 0);
}

function formatMoment(timeZone) {
  const now = new Date();
  const options = { hour: "2-digit", minute: "2-digit" };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  return now.toLocaleTimeString([], options);
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines.shift()?.split(",") || [];
  return lines.map((line) => {
    const values = line.split(",");
    const record = {};
    header.forEach((key, index) => {
      record[key] = values[index] ?? "";
    });
    return record;
  });
}

function normalizeTemp(tempValue) {
  return WEATHER_UNITS === "metric" ? tempValue * 1.8 + 32 : tempValue;
}

function bucketTemp(tempValue) {
  const tempF = normalizeTemp(tempValue);
  if (tempF < 45) return "cold";
  if (tempF < 60) return "cool";
  if (tempF < 75) return "mild";
  return "warm";
}

function getRegionFromTimeZone(timeZone) {
  if (!timeZone) return "eastern";
  if (timeZone.includes("Chicago")) return "central";
  if (timeZone.includes("Denver")) return "mountain";
  if (timeZone.includes("Phoenix")) return "mountain";
  if (timeZone.includes("Los_Angeles")) return "pacific";
  if (timeZone.includes("Anchorage")) return "alaska";
  if (timeZone.includes("Honolulu")) return "hawaii";
  return "eastern";
}

function buildFeatureVector({ moods, timeSegment, weather, tempValue, timeZone }) {
  const features = [];
  moodKeys.forEach((mood) => features.push(moods.includes(mood) ? 1 : 0));
  timeSegments.forEach((segment) => features.push(segment === timeSegment ? 1 : 0));
  weatherKeys.forEach((key) => features.push(key === weather ? 1 : 0));
  const bucket = bucketTemp(tempValue);
  tempBuckets.forEach((value) => features.push(value === bucket ? 1 : 0));
  const region = getRegionFromTimeZone(timeZone);
  regionKeys.forEach((value) => features.push(value === region ? 1 : 0));
  features.push(1);
  return features;
}

function buildProfileLookup(rows) {
  const counts = new Map();
  rows.forEach((row) => {
    const profileId = row.profileId;
    if (!counts.has(profileId)) {
      counts.set(profileId, new Map());
    }
    const nameKey = `${row.drinkName}|||${row.drinkNotes}`;
    const profileCounts = counts.get(profileId);
    profileCounts.set(nameKey, (profileCounts.get(nameKey) || 0) + 1);
  });

  const lookup = new Map();
  counts.forEach((profileCounts, profileId) => {
    let bestKey = "";
    let bestCount = -1;
    profileCounts.forEach((count, key) => {
      if (count > bestCount) {
        bestKey = key;
        bestCount = count;
      }
    });
    const [name, notes] = bestKey.split("|||");
    lookup.set(profileId, { name, notes });
  });

  return lookup;
}

function trainSoftmax(features, labels, classes, epochs, learningRate) {
  const numClasses = classes.length;
  const numFeatures = features[0]?.length || 0;
  const weights = Array.from({ length: numClasses }, () =>
    Array.from({ length: numFeatures }, () => 0)
  );

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    for (let i = 0; i < features.length; i += 1) {
      const x = features[i];
      const logits = weights.map((row) => dot(row, x));
      const probs = softmax(logits);
      const labelIndex = labels[i];

      for (let c = 0; c < numClasses; c += 1) {
        const error = probs[c] - (labelIndex === c ? 1 : 0);
        for (let j = 0; j < numFeatures; j += 1) {
          weights[c][j] -= learningRate * error * x[j];
        }
      }
    }
  }

  return { weights, classes };
}

function softmax(logits) {
  const max = Math.max(...logits);
  const exps = logits.map((value) => Math.exp(value - max));
  const sum = exps.reduce((acc, value) => acc + value, 0);
  return exps.map((value) => value / sum);
}

function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i += 1) {
    total += a[i] * b[i];
  }
  return total;
}

function predictProfile(modelState, features) {
  const logits = modelState.weights.map((row) => dot(row, features));
  const probs = softmax(logits);
  let bestIndex = 0;
  let bestScore = probs[0] ?? 0;
  for (let i = 1; i < probs.length; i += 1) {
    if (probs[i] > bestScore) {
      bestScore = probs[i];
      bestIndex = i;
    }
  }
  return modelState.classes[bestIndex];
}

async function loadModel() {
  updateMoodHint();
  try {
    let response = null;
    let lastError = null;

    for (const datasetUrl of DATASET_URLS) {
      try {
        const candidate = await fetch(datasetUrl, { cache: "no-store" });
        if (candidate.ok) {
          response = candidate;
          break;
        }
        lastError = new Error(`Dataset fetch failed (${candidate.status}) at ${datasetUrl}`);
      } catch (error) {
        lastError = error;
      }
    }

    if (!response) {
      throw lastError || new Error("Dataset fetch failed");
    }

    const text = await response.text();
    const records = parseCsv(text);
    const rows = records.map((record) => ({
      moods: record.moods.split("|").filter(Boolean),
      timeSegment: record.time_segment,
      city: record.city,
      state: record.state,
      timeZone: record.time_zone,
      tempValue: Number(record.temperature_f),
      weather: record.weather,
      profileId: record.profile_id,
      drinkName: record.drink_name,
      drinkNotes: record.drink_notes,
    }));

    profileLookup = buildProfileLookup(rows);

    const classIndex = new Map();
    const classes = [];
    const features = [];
    const labels = [];

    rows.forEach((row) => {
      if (!classIndex.has(row.profileId)) {
        classIndex.set(row.profileId, classes.length);
        classes.push(row.profileId);
      }
      features.push(
        buildFeatureVector({
          moods: row.moods,
          timeSegment: row.timeSegment,
          weather: row.weather,
          tempValue: row.tempValue,
          timeZone: row.timeZone,
        })
      );
      labels.push(classIndex.get(row.profileId));
    });

    model = trainSoftmax(features, labels, classes, MODEL_EPOCHS, MODEL_LEARNING_RATE);
    modelReady = true;
    updateMoodHint();
  } catch (error) {
    console.error("Model load failed:", error);
    modelReady = false;
    updateMoodHint();
  }
}


function sanitizeLocation(value) {
  return value.trim().replace(/\s+/g, " ");
}

function parseIngredients(notes) {
  return (notes || "")
    .split(";")
    .map((part) => part.replace(/^\s*and\s+/i, "").trim())
    .map((part) => part.replace(/\.$/, ""))
    .filter(Boolean);
}

function inferDrinkType(profileId, drink) {
  const text = `${profileId || ""} ${drink?.name || ""} ${drink?.notes || ""}`.toLowerCase();

  if (text.includes("matcha")) return "matcha";
  if (text.includes("cold brew")) return "cold_brew";
  if (text.includes("sparkling") || text.includes("tonic") || text.includes("soda")) return "sparkling";
  if (text.includes("cacao") || text.includes("cocoa")) return "cacao";
  if (text.includes("tea") || text.includes("jasmine") || text.includes("chamomile") || text.includes("assam")) return "tea";
  if (text.includes("espresso") || text.includes("latte") || text.includes("cortado")) return "espresso";
  return "house";
}

function buildRecipeSteps(drink, profileId) {
  const ingredients = parseIngredients(drink.notes);
  const [base, ...rest] = ingredients;
  const finish = rest[rest.length - 1];
  const middle = rest.slice(0, -1);
  const drinkType = inferDrinkType(profileId, drink);

  if (!ingredients.length) {
    return [
      "Step 1: Add 2 oz base coffee or tea to a cup.",
      "Step 2: Mix in 6 oz milk or water plus 0.5 oz sweetener.",
      "Step 3: Stir well and serve warm, or pour over 8 oz ice.",
    ];
  }

  if (drinkType === "espresso") {
    return [
      `Step 1: Pull 2 oz of ${base}.`,
      middle.length ? `Step 2: Steam and blend in 6 oz ${middle.join(", ")}.` : "Step 2: Steam and add 6 oz milk.",
      finish ? `Step 3: Top with about 0.25 oz ${finish}.` : "Step 3: Finish with a 0.5-inch foam cap.",
      "Step 4: Serve immediately while hot.",
    ];
  }

  if (drinkType === "matcha") {
    return [
      `Step 1: Whisk 1 tsp ${base} with 2 oz hot water until smooth.`,
      middle.length ? `Step 2: Add 6 oz ${middle.join(", ")} and shake or whisk again.` : "Step 2: Add 6 oz milk and mix until silky.",
      finish ? `Step 3: Finish with about 0.25 oz ${finish}.` : "Step 3: Pour over 8 oz ice or serve warm.",
      "Step 4: Taste and adjust sweetness before serving.",
    ];
  }

  if (drinkType === "tea") {
    return [
      `Step 1: Brew 8 oz ${base}.`,
      middle.length ? `Step 2: Infuse with ${middle.join(", ")} (about 0.25-0.5 oz each).` : "Step 2: Steep 3-5 minutes to your preferred strength.",
      finish ? `Step 3: Finish with about 0.25 oz ${finish}.` : "Step 3: Strain and pour into your cup.",
      "Step 4: Serve warm or chill over ice.",
    ];
  }

  if (drinkType === "cold_brew") {
    return [
      `Step 1: Fill a glass with 8 oz ice and pour in 4 oz ${base}.`,
      middle.length ? `Step 2: Stir in 2-4 oz ${middle.join(", ")}.` : "Step 2: Add 3 oz mixer and stir gently.",
      finish ? `Step 3: Garnish with about 0.25 oz ${finish}.` : "Step 3: Garnish and serve cold.",
      "Step 4: Serve immediately over ice.",
    ];
  }

  if (drinkType === "sparkling") {
    return [
      `Step 1: Start with 2 oz chilled ${base}.`,
      middle.length ? `Step 2: Add 1 oz ${middle.join(", ")} and stir lightly.` : "Step 2: Add 1 oz citrus or syrup base.",
      finish ? `Step 3: Top with 4 oz ${finish} to keep it bright.` : "Step 3: Top with 4 oz tonic or soda.",
      "Step 4: Serve immediately while bubbly.",
    ];
  }

  if (drinkType === "cacao") {
    return [
      `Step 1: Warm 8 oz ${base} in a small saucepan or steam pitcher.`,
      middle.length ? `Step 2: Whisk in 0.5-1 oz ${middle.join(", ")} until fully dissolved.` : "Step 2: Whisk until smooth and glossy.",
      finish ? `Step 3: Finish with about 0.25 oz ${finish}.` : "Step 3: Finish with a pinch of spice or salt.",
      "Step 4: Pour into a mug and serve warm.",
    ];
  }

  const steps = [`Step 1: Start with 2-4 oz ${base}.`];

  if (middle.length) {
    steps.push(`Step 2: Add 1-3 oz ${middle.join(", ")}.`);
  }

  if (finish) {
    steps.push(`Step ${steps.length + 1}: Finish with about 0.25 oz ${finish}.`);
  }

  steps.push(`Step ${steps.length + 1}: Stir, taste, and serve.`);
  return steps;
}

function toTitleCase(value) {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildWhyThisDrink({ moods, timeSegment, weatherCondition, tempValue, timeZone }) {
  const moodText = moods
    .map((mood) => moodLabels[mood] || toTitleCase(mood))
    .join(" and ");
  const tempBucket = bucketTemp(tempValue);

  const weatherPhrase = {
    clear: "clear skies",
    "mostly clear": "mostly clear weather",
    overcast: "overcast weather",
    fog: "foggy weather",
    drizzle: "light drizzle",
    rain: "rainy weather",
    snow: "snowy weather",
    showers: "passing showers",
    thunderstorm: "stormy weather",
    "mixed conditions": "mixed weather",
  };

  const tempPhrase = {
    cold: "something warming and cozy",
    cool: "something smooth and comforting",
    mild: "something balanced and easy-drinking",
    warm: "something bright and refreshing",
  };

  const timePhrase = {
    morning: "to start your day",
    afternoon: "to match your afternoon pace",
    evening: "to ease into the evening",
  };

  const weatherText = weatherPhrase[weatherCondition] || "today's weather";
  const tempText = tempPhrase[tempBucket] || "a balanced drink";
  const timeText = timePhrase[timeSegment] || "for this moment";

  return `Why this drink: With your ${moodText} mood, ${weatherText}, and ${tempBucket} temperatures, this choice leans toward ${tempText} ${timeText}.`;
}

function recommendDrink(moods, timeZone) {
  const moodList = moods.length ? moods : ["calm"];
  const timeSegment = getTimeSegment(timeZone);
  const weatherCondition = latestWeather?.condition || "clear";
  const tempValue = latestWeather?.tempValue ?? 65;
  const modelFeatures = buildFeatureVector({
    moods: moodList,
    timeSegment,
    weather: weatherCondition,
    tempValue,
    timeZone,
  });

  const profileId = modelReady && model
    ? predictProfile(model, modelFeatures)
    : "fallback";
  const drink = profileLookup.get(profileId) || {
    name: "House blend",
    notes: "A balanced cafe favorite with a smooth finish.",
  };
  const whyThisDrink = buildWhyThisDrink({
    moods: moodList,
    timeSegment,
    weatherCondition,
    tempValue,
    timeZone,
  });

  return {
    title: drink.name,
    description: drink.notes,
    details: buildRecipeSteps(drink, profileId),
    whyThisDrink,
  };
}

function getSelectedMoods() {
  return Array.from(selectedMoods);
}

function renderRecommendation(recommendation) {
  title.textContent = recommendation.title;
  description.textContent = recommendation.description;
  details.innerHTML = "";

  recommendation.details.forEach((line, index) => {
    const item = document.createElement("div");
    item.textContent = line;
    item.style.animationDelay = `${index * 0.08}s`;
    item.classList.add("result__detail", "animate-in");
    details.appendChild(item);
  });

  if (recommendation.whyThisDrink) {
    const whyWrap = document.createElement("div");
    whyWrap.classList.add("result__why-wrap", "animate-in");
    whyWrap.style.animationDelay = `${recommendation.details.length * 0.08}s`;

    const whyToggle = document.createElement("button");
    whyToggle.type = "button";
    whyToggle.classList.add("result__why-toggle");
    whyToggle.textContent = "Why this drink? Click to reveal";
    whyToggle.setAttribute("aria-expanded", "false");

    const whyContent = document.createElement("div");
    whyContent.classList.add("result__detail", "result__detail--why");
    whyContent.textContent = recommendation.whyThisDrink;
    whyContent.hidden = true;

    whyToggle.addEventListener("click", () => {
      const isOpen = whyToggle.getAttribute("aria-expanded") === "true";
      whyToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
      whyToggle.textContent = isOpen ? "Why this drink? Click to reveal" : "Hide why this drink";
      whyContent.hidden = isOpen;
    });

    whyWrap.appendChild(whyToggle);
    whyWrap.appendChild(whyContent);
    details.appendChild(whyWrap);
  }
}

function buildCityList() {
  cityList.forEach((city) => {
    const label = `${city.name}, ${city.state}`;
    const option = document.createElement("option");
    option.value = label;
    cityListEl.appendChild(option);
    cityIndex.set(label.toLowerCase(), city);
  });
}

function formatWeather(summary) {
  return `Weather: ${summary.temp}${TEMP_UNIT}, ${summary.condition}`;
}

async function fetchWeather(city) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", city.lat);
  url.searchParams.set("longitude", city.lon);
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("temperature_unit", WEATHER_UNITS === "metric" ? "celsius" : "fahrenheit");

  weatherEl.textContent = "Weather: fetching...";

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Weather lookup failed");
    }
    const data = await response.json();
    const temp = Math.round(data.current?.temperature_2m ?? 0);
    const condition = mapWeatherCode(data.current?.weather_code);
    latestWeather = {
      tempValue: normalizeTemp(temp),
      displayTemp: temp,
      condition,
    };
    weatherEl.textContent = formatWeather({ temp, condition });
  } catch (error) {
    latestWeather = null;
    weatherEl.textContent = "Weather: unavailable";
  }
}

function mapWeatherCode(code) {
  if (code === undefined || code === null) {
    return "clear";
  }

  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "mostly clear";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([80, 81, 82].includes(code)) return "showers";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  return "mixed conditions";
}

locationInput.addEventListener("input", () => {
  const value = sanitizeLocation(locationInput.value);
  locationInput.value = value;
  const city = cityIndex.get(value.toLowerCase());

  if (city) {
    selectedCity = city;
    locationInput.setCustomValidity("");
    fetchWeather(city);
    updateMoment();
    return;
  }

  selectedCity = null;
  latestWeather = null;
  weatherEl.textContent = "Weather: --";
  locationInput.setCustomValidity("Please select a city from the list.");
  updateMoment();
});

moodPicker.addEventListener("click", (event) => {
  const button = event.target.closest(".mood-option");
  if (!button) {
    return;
  }

  const mood = button.dataset.mood;
  if (!mood) {
    return;
  }

  if (selectedMoods.has(mood)) {
    selectedMoods.delete(mood);
  } else if (selectedMoods.size < 3) {
    selectedMoods.add(mood);
  }

  updateMoodButtons();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const moods = getSelectedMoods();
  const location = sanitizeLocation(locationInput.value);

  if (!moods.length || !location) {
    if (!moods.length) {
      moodHint.textContent = "Select up to 3 moods (at least 1 required).";
    }
    return;
  }

  if (!selectedCity) {
    locationInput.reportValidity();
    return;
  }

  const recommendation = recommendDrink(moods, selectedCity?.timeZone);
  renderRecommendation(recommendation);
  result.classList.remove("animate-in");
  void result.offsetWidth;
  result.classList.add("animate-in");
});

function updateMoment() {
  if (!selectedCity) {
    momentEl.textContent = "Local time: --";
    return;
  }

  momentEl.textContent = `Local time: ${formatMoment(selectedCity.timeZone)}`;
}

function updateMoodButtons() {
  const buttons = moodPicker.querySelectorAll(".mood-option");
  const reachedLimit = selectedMoods.size >= 3;

  buttons.forEach((button) => {
    const mood = button.dataset.mood;
    const isSelected = selectedMoods.has(mood);
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    button.disabled = !isSelected && reachedLimit;
  });

  moodHint.textContent = reachedLimit
    ? "Mood limit reached (3)."
    : "Select up to 3 moods.";
  updateMoodHint(moodHint.textContent);
}

buildCityList();
updateMoodButtons();
updateMoment();
loadModel();
setInterval(updateMoment, 1000 * 30);
