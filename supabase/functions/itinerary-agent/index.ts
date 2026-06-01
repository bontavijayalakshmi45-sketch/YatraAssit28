import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelersCount: number;
  travelType: string;
  language: string;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
}

interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  accommodation: string;
  notes: string;
}

function generateItinerary(request: ItineraryRequest): ItineraryDay[] {
  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dailyBudget = request.budget / daysCount;

  const itinerary: ItineraryDay[] = [];

  const activityTemplates = {
    spiritual: [
      { title: "Morning Temple Visit", description: "Visit the sacred temple for morning prayers" },
      { title: "Meditation Session", description: "Participate in guided meditation" },
      { title: "Heritage Walk", description: "Explore ancient spiritual sites" },
      { title: "Evening Aarti", description: "Witness the divine evening ceremony" },
    ],
    adventure: [
      { title: "Morning Trek", description: "Early morning trekking expedition" },
      { title: "Adventure Sports", description: "Experience thrilling activities" },
      { title: "Nature Trail", description: "Explore scenic hiking trails" },
      { title: "Camp Activities", description: "Evening bonfire and camping" },
    ],
    heritage: [
      { title: "Monument Visit", description: "Explore historical monuments" },
      { title: "Museum Tour", description: "Visit local museums and galleries" },
      { title: "Heritage Walk", description: "Guided heritage walking tour" },
      { title: "Light & Sound Show", description: "Evening cultural performance" },
    ],
    beach: [
      { title: "Beach Morning", description: "Relax on pristine beaches" },
      { title: "Water Sports", description: "Enjoy water activities" },
      { title: "Becomside Exploration", description: "Explore coastal attractions" },
      { title: "Sunset Cruise", description: "Evening boat cruise" },
    ],
    wildlife: [
      { title: "Safari Drive", description: "Early morning wildlife safari" },
      { title: "Bird Watching", description: "Spot exotic bird species" },
      { title: "Nature Walk", description: "Guided jungle walk" },
      { title: "Evening Safari", description: "Evening wildlife expedition" },
    ],
  };

  const templates = activityTemplates[request.travelType as keyof typeof activityTemplates] || activityTemplates.heritage;

  for (let i = 0; i < daysCount; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + i);

    const activities: Activity[] = [
      {
        time: "08:00",
        title: templates[0].title,
        description: templates[0].description,
        location: request.destination,
        duration: "2 hours",
        cost: Math.round(dailyBudget * 0.12),
      },
      {
        time: "12:00",
        title: templates[1].title,
        description: templates[1].description,
        location: request.destination,
        duration: "2 hours",
        cost: Math.round(dailyBudget * 0.15),
      },
      {
        time: "15:00",
        title: templates[2].title,
        description: templates[2].description,
        location: request.destination,
        duration: "2.5 hours",
        cost: Math.round(dailyBudget * 0.13),
      },
      {
        time: "18:00",
        title: templates[3].title,
        description: templates[3].description,
        location: request.destination,
        duration: "2 hours",
        cost: Math.round(dailyBudget * 0.10),
      },
    ];

    itinerary.push({
      day: i + 1,
      date: dayDate.toISOString().split("T")[0],
      activities,
      meals: {
        breakfast: "Hotel buffet or local cafe",
        lunch: "Traditional local restaurant",
        dinner: "Regional specialty cuisine",
      },
      accommodation: "Quality hotel in city center",
      notes: "Carry water, sunscreen, and comfortable walking shoes",
    });
  }

  return itinerary;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const request: ItineraryRequest = await req.json();

    if (!request.destination || !request.startDate || !request.endDate) {
      return new Response(
        JSON.stringify({ error: "Destination, start date, and end date are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const itinerary = generateItinerary(request);

    return new Response(
      JSON.stringify({ itinerary, success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate itinerary" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
