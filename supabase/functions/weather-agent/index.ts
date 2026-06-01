import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WeatherInfo {
  destination: string;
  current_season: string;
  temperature_range: { min: number; max: number };
  weather_description: string;
  best_months: string[];
  seasonal_tips: string;
}

const weatherData: Record<string, WeatherInfo> = {
  varanasi: {
    destination: "Varanasi",
    current_season: "Varies",
    temperature_range: { min: 12, max: 38 },
    weather_description: "Varanasi experiences a humid subtropical climate with hot summers, monsoon rains, and pleasant winters.",
    best_months: ["October", "November", "December", "January", "February", "March"],
    seasonal_tips: "Winters are ideal for sightseeing. Monsoon brings relief from summer heat but can cause flooding near ghats.",
  },
  goa: {
    destination: "Goa",
    current_season: "Varies",
    temperature_range: { min: 21, max: 34 },
    weather_description: "Goa has a tropical monsoon climate with pleasant winters, hot summers, and heavy monsoon rains.",
    best_months: ["November", "December", "January", "February"],
    seasonal_tips: "Peak tourist season is winter. Avoid monsoon (June-September) for beach activities.",
  },
  jaipur: {
    destination: "Jaipur",
    current_season: "Varies",
    temperature_range: { min: 8, max: 42 },
    weather_description: "Jaipur has a semi-arid climate with extremely hot summers and mild winters.",
    best_months: ["October", "November", "December", "January", "February", "March"],
    seasonal_tips: "Winters are perfect for outdoor sightseeing. Avoid April-June when temperatures can exceed 45C.",
  },
  manali: {
    destination: "Manali",
    current_season: "Varies",
    temperature_range: { min: -5, max: 28 },
    weather_description: "Manali has a cold climate with heavy snowfall in winter and pleasant summers.",
    best_months: ["May", "June", "July", "August", "September", "October"],
    seasonal_tips: "Summer is best for adventure activities. Winter (Dec-Feb) for snow activities. Avoid monsoon landslides.",
  },
  ladakh: {
    destination: "Ladakh",
    current_season: "Varies",
    temperature_range: { min: -20, max: 25 },
    weather_description: "Ladakh has a cold desert climate with harsh winters and pleasant summers.",
    best_months: ["May", "June", "July", "August", "September"],
    seasonal_tips: "Roads open from May to October only. Be prepared for altitude sickness. Carry warm clothes always.",
  },
  rishikesh: {
    destination: "Rishikesh",
    current_season: "Varies",
    temperature_range: { min: 10, max: 38 },
    weather_description: "Rishikesh has a pleasant climate year-round with hot summers and cool winters.",
    best_months: ["September", "October", "November", "March", "April", "May"],
    seasonal_tips: "September-May is ideal for rafting. Avoid peak monsoon (July-August) when rafting stops.",
  },
  kerala: {
    destination: "Kerala",
    current_season: "Varies",
    temperature_range: { min: 22, max: 33 },
    weather_description: "Kerala has a tropical climate with heavy monsoon rains and pleasant winters.",
    best_months: ["September", "October", "November", "December", "January", "February", "March"],
    seasonal_tips: "Winter is perfect for backwaters and beaches. Monsoon (June-August) offers Ayurveda treatments.",
  },
  andaman: {
    destination: "Andaman",
    current_season: "Varies",
    temperature_range: { min: 23, max: 32 },
    weather_description: "Andaman has a tropical climate with warm weather year-round and monsoon rains.",
    best_months: ["October", "November", "December", "January", "February", "March", "April", "May"],
    seasonal_tips: "October-May is best for water activities. Avoid monsoon (June-September) due to rough seas.",
  },
};

function getWeather(destination: string): WeatherInfo | null {
  const key = destination.toLowerCase().split(" ")[0];
  return weatherData[key] || null;
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 5) return "Summer";
  if (month >= 6 && month <= 9) return "Monsoon";
  return "Winter";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let destination = "";

    // Handle GET requests with query params
    if (req.method === "GET") {
      const url = new URL(req.url);
      destination = url.searchParams.get("destination") || "";
    }
    // Handle POST requests with body
    else if (req.method === "POST") {
      const body = await req.json();
      destination = body.destination || "";
    }

    if (!destination) {
      return new Response(
        JSON.stringify({
          error: "Destination is required",
          current_season: getCurrentSeason(),
          available_destinations: Object.keys(weatherData),
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const weather = getWeather(destination);

    if (!weather) {
      return new Response(
        JSON.stringify({
          error: "Weather data not available for this destination",
          current_season: getCurrentSeason(),
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add current season
    const result = {
      ...weather,
      current_season: getCurrentSeason(),
    };

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
