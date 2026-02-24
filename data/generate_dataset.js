const fs = require("fs");
const path = require("path");

const moods = [
  "angry",
  "anxious",
  "bored",
  "calm",
  "curious",
  "gloomy",
  "happy",
  "hopeful",
  "lonely",
  "motivated",
  "numb",
  "restless",
  "sad",
  "stressed",
  "tired",
];

const timeSegments = ["morning", "afternoon", "evening"];
const weatherConditions = [
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

const cityList = [
  { name: "New York", state: "NY", timeZone: "America/New_York" },
  { name: "Los Angeles", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Chicago", state: "IL", timeZone: "America/Chicago" },
  { name: "Houston", state: "TX", timeZone: "America/Chicago" },
  { name: "Phoenix", state: "AZ", timeZone: "America/Phoenix" },
  { name: "Philadelphia", state: "PA", timeZone: "America/New_York" },
  { name: "San Antonio", state: "TX", timeZone: "America/Chicago" },
  { name: "San Diego", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Dallas", state: "TX", timeZone: "America/Chicago" },
  { name: "San Jose", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Austin", state: "TX", timeZone: "America/Chicago" },
  { name: "Jacksonville", state: "FL", timeZone: "America/New_York" },
  { name: "Fort Worth", state: "TX", timeZone: "America/Chicago" },
  { name: "Columbus", state: "OH", timeZone: "America/New_York" },
  { name: "Charlotte", state: "NC", timeZone: "America/New_York" },
  { name: "San Francisco", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Indianapolis", state: "IN", timeZone: "America/Indiana/Indianapolis" },
  { name: "Seattle", state: "WA", timeZone: "America/Los_Angeles" },
  { name: "Denver", state: "CO", timeZone: "America/Denver" },
  { name: "Washington", state: "DC", timeZone: "America/New_York" },
  { name: "Boston", state: "MA", timeZone: "America/New_York" },
  { name: "El Paso", state: "TX", timeZone: "America/Denver" },
  { name: "Nashville", state: "TN", timeZone: "America/Chicago" },
  { name: "Detroit", state: "MI", timeZone: "America/Detroit" },
  { name: "Portland", state: "OR", timeZone: "America/Los_Angeles" },
  { name: "Memphis", state: "TN", timeZone: "America/Chicago" },
  { name: "Oklahoma City", state: "OK", timeZone: "America/Chicago" },
  { name: "Las Vegas", state: "NV", timeZone: "America/Los_Angeles" },
  { name: "Louisville", state: "KY", timeZone: "America/New_York" },
  { name: "Baltimore", state: "MD", timeZone: "America/New_York" },
  { name: "Milwaukee", state: "WI", timeZone: "America/Chicago" },
  { name: "Albuquerque", state: "NM", timeZone: "America/Denver" },
  { name: "Tucson", state: "AZ", timeZone: "America/Phoenix" },
  { name: "Fresno", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Mesa", state: "AZ", timeZone: "America/Phoenix" },
  { name: "Sacramento", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Atlanta", state: "GA", timeZone: "America/New_York" },
  { name: "Kansas City", state: "MO", timeZone: "America/Chicago" },
  { name: "Colorado Springs", state: "CO", timeZone: "America/Denver" },
  { name: "Miami", state: "FL", timeZone: "America/New_York" },
  { name: "Raleigh", state: "NC", timeZone: "America/New_York" },
  { name: "Omaha", state: "NE", timeZone: "America/Chicago" },
  { name: "Oakland", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Minneapolis", state: "MN", timeZone: "America/Chicago" },
  { name: "Tulsa", state: "OK", timeZone: "America/Chicago" },
  { name: "Cleveland", state: "OH", timeZone: "America/New_York" },
  { name: "Wichita", state: "KS", timeZone: "America/Chicago" },
  { name: "Arlington", state: "TX", timeZone: "America/Chicago" },
  { name: "New Orleans", state: "LA", timeZone: "America/Chicago" },
  { name: "Bakersfield", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Tampa", state: "FL", timeZone: "America/New_York" },
  { name: "Honolulu", state: "HI", timeZone: "Pacific/Honolulu" },
  { name: "Anaheim", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Santa Ana", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Aurora", state: "CO", timeZone: "America/Denver" },
  { name: "St. Louis", state: "MO", timeZone: "America/Chicago" },
  { name: "Riverside", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Corpus Christi", state: "TX", timeZone: "America/Chicago" },
  { name: "Lexington", state: "KY", timeZone: "America/New_York" },
  { name: "Stockton", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Pittsburgh", state: "PA", timeZone: "America/New_York" },
  { name: "Cincinnati", state: "OH", timeZone: "America/New_York" },
  { name: "St. Paul", state: "MN", timeZone: "America/Chicago" },
  { name: "Anchorage", state: "AK", timeZone: "America/Anchorage" },
  { name: "Greensboro", state: "NC", timeZone: "America/New_York" },
  { name: "Plano", state: "TX", timeZone: "America/Chicago" },
  { name: "Lincoln", state: "NE", timeZone: "America/Chicago" },
  { name: "Orlando", state: "FL", timeZone: "America/New_York" },
  { name: "Irvine", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Newark", state: "NJ", timeZone: "America/New_York" },
  { name: "Toledo", state: "OH", timeZone: "America/New_York" },
  { name: "Durham", state: "NC", timeZone: "America/New_York" },
  { name: "Chula Vista", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Fort Wayne", state: "IN", timeZone: "America/Indiana/Indianapolis" },
  { name: "Long Beach", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Irving", state: "TX", timeZone: "America/Chicago" },
  { name: "Laredo", state: "TX", timeZone: "America/Chicago" },
  { name: "Chandler", state: "AZ", timeZone: "America/Phoenix" },
  { name: "Madison", state: "WI", timeZone: "America/Chicago" },
  { name: "Huntsville", state: "AL", timeZone: "America/Chicago" },
  { name: "Garland", state: "TX", timeZone: "America/Chicago" },
  { name: "Hialeah", state: "FL", timeZone: "America/New_York" },
  { name: "McKinney", state: "TX", timeZone: "America/Chicago" },
  { name: "Winston-Salem", state: "NC", timeZone: "America/New_York" },
  { name: "Brownsville", state: "TX", timeZone: "America/Chicago" },
  { name: "Fontana", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Santa Clarita", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Rancho Cucamonga", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Modesto", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Fayetteville", state: "NC", timeZone: "America/New_York" },
  { name: "Tallahassee", state: "FL", timeZone: "America/New_York" },
  { name: "Huntington Beach", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Fremont", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Buffalo", state: "NY", timeZone: "America/New_York" },
  { name: "Baton Rouge", state: "LA", timeZone: "America/Chicago" },
  { name: "Jersey City", state: "NJ", timeZone: "America/New_York" },
  { name: "Spokane", state: "WA", timeZone: "America/Los_Angeles" },
  { name: "Aurora", state: "IL", timeZone: "America/Chicago" },
  { name: "Scottsdale", state: "AZ", timeZone: "America/Phoenix" },
  { name: "Glendale", state: "AZ", timeZone: "America/Phoenix" },
  { name: "Moreno Valley", state: "CA", timeZone: "America/Los_Angeles" },
  { name: "Shreveport", state: "LA", timeZone: "America/Chicago" },
  { name: "Providence", state: "RI", timeZone: "America/New_York" },
  { name: "New Haven", state: "CT", timeZone: "America/New_York" },
];

const drinkMatrix = {
  angry: {
    morning: {
      name: "Spiced cacao espresso",
      notes: "Espresso, cacao, ancho chili, and smoked sea salt.",
    },
    afternoon: {
      name: "Hibiscus nitro fizz",
      notes: "Nitro cold brew, hibiscus, berry shrub, and soda.",
    },
    evening: {
      name: "Miso caramel latte",
      notes: "Espresso, miso caramel, and velvety oat milk.",
    },
  },
  anxious: {
    morning: {
      name: "Ginger citrus tea",
      notes: "Black tea, ginger, lemon, and a touch of honey.",
    },
    afternoon: {
      name: "Rosey oat latte",
      notes: "Espresso, oat milk, rose syrup, and cardamom.",
    },
    evening: {
      name: "Warm almond cacao",
      notes: "Cacao, almond milk, and a pinch of cinnamon.",
    },
  },
  bored: {
    morning: {
      name: "Tropical iced matcha",
      notes: "Matcha, coconut milk, pineapple, and lime zest.",
    },
    afternoon: {
      name: "Sparkling yuzu espresso",
      notes: "Espresso, yuzu soda, and mint.",
    },
    evening: {
      name: "Black sesame latte",
      notes: "Espresso, black sesame, and steamed milk.",
    },
  },
  calm: {
    morning: {
      name: "Lavender oat flat white",
      notes: "Oat milk flat white with lavender and vanilla.",
    },
    afternoon: {
      name: "Coconut jasmine cooler",
      notes: "Jasmine tea, coconut water, and yuzu.",
    },
    evening: {
      name: "Chamomile vanilla steam",
      notes: "Chamomile, vanilla bean, and warm milk.",
    },
  },
  curious: {
    morning: {
      name: "Cardamom cortado",
      notes: "Espresso, milk, and cardamom.",
    },
    afternoon: {
      name: "Yuzu cold brew",
      notes: "Cold brew, yuzu, and sparkling water.",
    },
    evening: {
      name: "Black sesame latte",
      notes: "Espresso, black sesame, and steamed milk.",
    },
  },
  gloomy: {
    morning: {
      name: "Mocha drizzle",
      notes: "Espresso, cocoa, and dark sugar.",
    },
    afternoon: {
      name: "Maple oat latte",
      notes: "Espresso, oat milk, and maple syrup.",
    },
    evening: {
      name: "Smoky cacao",
      notes: "Cacao, smoked salt, and warm milk.",
    },
  },
  happy: {
    morning: {
      name: "Sunrise espresso tonic",
      notes: "Double espresso, tonic, orange peel, and rosemary mist.",
    },
    afternoon: {
      name: "Citrus cold brew spritz",
      notes: "Cold brew, grapefruit soda, honey, and a twist of lime.",
    },
    evening: {
      name: "Golden matcha cloud",
      notes: "Matcha, oat milk, turmeric, and a salted honey cap.",
    },
  },
  hopeful: {
    morning: {
      name: "Citrus matcha",
      notes: "Matcha, lemon, and oat milk.",
    },
    afternoon: {
      name: "Sparkling peach tea",
      notes: "White tea, peach, and soda.",
    },
    evening: {
      name: "Lavender honey latte",
      notes: "Espresso, lavender, and honey.",
    },
  },
  lonely: {
    morning: {
      name: "Vanilla oat cappuccino",
      notes: "Espresso, oat milk foam, and vanilla bean.",
    },
    afternoon: {
      name: "Honey almond latte",
      notes: "Espresso, almond milk, and soft honey.",
    },
    evening: {
      name: "Cocoa comfort",
      notes: "Cocoa, warm milk, and a pinch of cinnamon.",
    },
  },
  motivated: {
    morning: {
      name: "Straight shot macchiato",
      notes: "Espresso with a spoon of foam.",
    },
    afternoon: {
      name: "Iced oat americano",
      notes: "Espresso, water, and a splash of oat milk.",
    },
    evening: {
      name: "Cascara tea",
      notes: "Coffee cherry tea, citrus, and honey.",
    },
  },
  numb: {
    morning: {
      name: "Warm vanilla latte",
      notes: "Espresso, vanilla, and steamed milk.",
    },
    afternoon: {
      name: "Cocoa oat",
      notes: "Cocoa, oat milk, and a hint of salt.",
    },
    evening: {
      name: "Quiet chamomile",
      notes: "Chamomile tea with soft honey.",
    },
  },
  restless: {
    morning: {
      name: "Bright lime cold brew",
      notes: "Cold brew, lime, and a touch of agave.",
    },
    afternoon: {
      name: "Minted espresso shaker",
      notes: "Espresso, mint, and lightly sweetened milk.",
    },
    evening: {
      name: "Peppermint mocha",
      notes: "Espresso, cocoa, peppermint, and steamed milk.",
    },
  },
  sad: {
    morning: {
      name: "Soft cacao mocha",
      notes: "Espresso, cocoa, vanilla, and warm milk.",
    },
    afternoon: {
      name: "Honey oat latte",
      notes: "Espresso, oat milk, and a slow drizzle of honey.",
    },
    evening: {
      name: "Vanilla chamomile",
      notes: "Chamomile tea, vanilla bean, and steamed milk.",
    },
  },
  stressed: {
    morning: {
      name: "Clean shot cortado",
      notes: "Ristretto, silky milk, and a hint of cacao nib.",
    },
    afternoon: {
      name: "Black tea tonic",
      notes: "Assam tea, tonic, lemon, and a touch of sage.",
    },
    evening: {
      name: "Jasmine clarity latte",
      notes: "Jasmine tea concentrate, milk, and a whisper of honey.",
    },
  },
  tired: {
    morning: {
      name: "Toasted hazelnut latte",
      notes: "Espresso, steamed oat milk, hazelnut, and cinnamon dust.",
    },
    afternoon: {
      name: "Maple chai blanket",
      notes: "Black tea, chai spice, maple, and vanilla cream.",
    },
    evening: {
      name: "Cocoa hush steamer",
      notes: "Cocoa, brown sugar, cinnamon, and warm almond milk.",
    },
  },
};

let seed = 42;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function pick(list) {
  return list[Math.floor(random() * list.length)];
}

function pickMoods() {
  const count = Math.floor(random() * 3) + 1;
  const shuffled = [...moods].sort(() => random() - 0.5);
  return shuffled.slice(0, count);
}

function deriveProfileId(name) {
  const lowered = name.toLowerCase();
  if (lowered.includes("matcha")) return "matcha_creamy";
  if (lowered.includes("chai") || lowered.includes("jasmine") || lowered.includes("tea")) {
    return "tea_floral";
  }
  if (lowered.includes("cocoa") || lowered.includes("mocha")) return "cacao_comfort";
  if (lowered.includes("tonic") || lowered.includes("spritz") || lowered.includes("fizz")) {
    return "sparkling_refresh";
  }
  if (lowered.includes("cold brew") || lowered.includes("iced")) return "cold_brew_refresh";
  if (lowered.includes("latte")) return "espresso_smooth";
  if (lowered.includes("espresso")) return "espresso_bold";
  return "house_blend";
}

function sanitizeNotes(notes) {
  return notes.replace(/,/g, ";");
}

function pickTemperature(weather) {
  if (weather === "snow") return Math.floor(30 + random() * 15);
  if (weather === "thunderstorm") return Math.floor(60 + random() * 20);
  if (weather === "rain" || weather === "showers") return Math.floor(45 + random() * 20);
  if (weather === "fog" || weather === "drizzle") return Math.floor(40 + random() * 20);
  if (weather === "overcast" || weather === "mostly clear") return Math.floor(50 + random() * 20);
  return Math.floor(55 + random() * 30);
}

const rows = [];
for (let i = 0; i < 1000; i += 1) {
  const moodList = pickMoods();
  const primaryMood = moodList[0];
  const timeSegment = pick(timeSegments);
  const city = pick(cityList);
  const weather = pick(weatherConditions);
  const temperature = pickTemperature(weather);
  const drink = drinkMatrix[primaryMood][timeSegment];
  const profileId = deriveProfileId(drink.name);

  rows.push({
    moods: moodList.join("|"),
    time_segment: timeSegment,
    city: city.name,
    state: city.state,
    time_zone: city.timeZone,
    temperature_f: temperature,
    weather,
    profile_id: profileId,
    drink_name: drink.name,
    drink_notes: sanitizeNotes(drink.notes),
  });
}

const header = [
  "moods",
  "time_segment",
  "city",
  "state",
  "time_zone",
  "temperature_f",
  "weather",
  "profile_id",
  "drink_name",
  "drink_notes",
];

const lines = [header.join(",")];
rows.forEach((row) => {
  lines.push(
    [
      row.moods,
      row.time_segment,
      row.city,
      row.state,
      row.time_zone,
      row.temperature_f,
      row.weather,
      row.profile_id,
      row.drink_name,
      row.drink_notes,
    ].join(",")
  );
});

const outputPath = path.join(__dirname, "brew_data.csv");
fs.writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${rows.length} rows to ${outputPath}`);
