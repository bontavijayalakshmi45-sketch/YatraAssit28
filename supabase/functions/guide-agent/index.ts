import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GuideRequest {
  destination: string;
  category: string;
}

interface Guide {
  destination: string;
  category: string;
  introduction: string;
  attractions: { name: string; description: string; timing: string; entry_fee: string }[];
  local_cuisine: string[];
  travel_tips: string[];
  getting_there: string;
  best_time: string;
}

const guides: Record<string, Guide> = {
  varanasi: {
    destination: "Varanasi",
    category: "spiritual",
    introduction: "Varanasi, one of the world's oldest continuously inhabited cities, is the spiritual heart of India. Situated on the banks of the sacred Ganges River, it's a city where life and death coexist in harmony.",
    attractions: [
      { name: "Dashashwamedh Ghat", description: "The most spectacular ghat for Ganga Aarti ceremony every evening at sunset", timing: "Open 24 hours, Aarti at 6:45 PM", entry_fee: "Free" },
      { name: "Kashi Vishwanath Temple", description: "One of the 12 Jyotirlingas, dedicated to Lord Shiva", timing: "4:00 AM - 11:00 PM", entry_fee: "Free (Special Darshan charges apply)" },
      { name: "Sarnath", description: "Where Buddha gave his first sermon, featuring ancient stupas and museums", timing: "8:00 AM - 5:00 PM", entry_fee: "100 for Indians" },
      { name: "Assi Ghat", description: "Southernmost ghat, popular for morning yoga and boat rides", timing: "Open 24 hours", entry_fee: "Free" },
    ],
    local_cuisine: ["Baati Chokha", "Tamatar Chaat", "Malaiyyo", "Kachori Sabzi", "Thandai", "Banarasi Paan"],
    travel_tips: [
      "Start your day with a sunrise boat ride",
      "Dress modestly when visiting temples",
      "Be prepared for crowds at popular ghats",
      "Carry cash for small purchases",
    ],
    getting_there: "Varanasi has an international airport (Lal Bahadur Shastri Airport) and is well-connected by rail and road to major cities.",
    best_time: "October to March",
  },
  goa: {
    destination: "Goa",
    category: "beach",
    introduction: "Goa, India's smallest state, is famous for its pristine beaches, Portuguese heritage, vibrant nightlife, and relaxed coastal charm.",
    attractions: [
      { name: "Baga Beach", description: "Popular beach with water sports, shacks, and nightlife", timing: "Open 24 hours", entry_fee: "Free, water sports extra" },
      { name: "Basilica of Bom Jesus", description: "UNESCO World Heritage site with the remains of St. Francis Xavier", timing: "9:00 AM - 6:30 PM", entry_fee: "Free" },
      { name: "Dudhsagar Falls", description: "Four-tiered waterfall on the Mandovi River", timing: "9:00 AM - 4:00 PM", entry_fee: "Jeep safari charges apply" },
      { name: "Anjuna Flea Market", description: "Famous Wednesday market for souvenirs and handicrafts", timing: "Every Wednesday 9:00 AM - 6:00 PM", entry_fee: "Free" },
    ],
    local_cuisine: ["Fish Curry Rice", "Vindaloo", "Bebinca", "Feni", "Prawn Balchao", "Xacuti"],
    travel_tips: [
      "Rent a scooter for easy exploration",
      "Book shacks in advance during peak season",
      "Carry sunscreen and stay hydrated",
      "Respect local customs at churches",
    ],
    getting_there: "Goa International Airport (Dabolim) connects to major cities. Konkan Railway provides scenic train journeys.",
    best_time: "November to February",
  },
  jaipur: {
    destination: "Jaipur",
    category: "heritage",
    introduction: "Jaipur, the Pink City, is a vibrant blend of royal heritage and modern energy. Its majestic forts and palaces tell tales of Rajput valor and grandeur.",
    attractions: [
      { name: "Amber Fort", description: "Majestic hilltop fort with artistic Hindu elements and panoramic views", timing: "8:00 AM - 5:30 PM", entry_fee: "500 for foreigners, 100 for Indians" },
      { name: "Hawa Mahal", description: "Palace of Winds with 953 small windows for royal women to observe street life", timing: "9:00 AM - 4:30 PM", entry_fee: "200 for foreigners, 50 for Indians" },
      { name: "City Palace", description: "Royal residence blending Rajasthani and Mughal architecture", timing: "9:00 AM - 5:00 PM", entry_fee: "500 for foreigners, 200 for Indians" },
      { name: "Jantar Mantar", description: "UNESCO site with 19 astronomical instruments", timing: "9:00 AM - 4:30 PM", entry_fee: "200 for foreigners, 50 for Indians" },
    ],
    local_cuisine: ["Dal Baati Churma", "Laal Maas", "Ghevar", "Pyaz Kachori", "Mirchi Vada", "Lassi"],
    travel_tips: [
      "Hire a guide at monuments for detailed history",
      "Visit early morning to avoid crowds",
      "Bargain at local markets like Johari Bazaar",
      "Dress modestly and carry a hat",
    ],
    getting_there: "Jaipur International Airport connects to major cities. Excellent rail and road connectivity as part of Golden Triangle.",
    best_time: "October to March",
  },
  manali: {
    destination: "Manali",
    category: "adventure",
    introduction: "Nestled in the Himalayas, Manali is a paradise for adventure seekers and nature lovers with snow-capped peaks and verdant valleys.",
    attractions: [
      { name: "Solang Valley", description: "Adventure hub for paragliding, skiing, and zorbing", timing: "10:00 AM - 5:00 PM", entry_fee: "Activity charges apply" },
      { name: "Rohtang Pass", description: "High mountain pass with spectacular views, open May-November", timing: "6:00 AM - 5:00 PM", entry_fee: "Permit required" },
      { name: "Hadimba Temple", description: "Ancient temple surrounded by cedar forests", timing: "8:00 AM - 6:00 PM", entry_fee: "Free" },
      { name: "Old Manali", description: "Charming area with cafes, apple orchards, and river views", timing: "Open 24 hours", entry_fee: "Free" },
    ],
    local_cuisine: ["Dham", "Sidu", "Babru", "River Trout", "Maggi", "Apple Pie"],
    travel_tips: [
      "Carry warm clothes even in summer",
      "Book Rohtang Pass permits in advance",
      "Avoid during monsoon (July-August)",
      "Stay hydrated at high altitude",
    ],
    getting_there: "Nearest airport is Kullu-Manali (50km). Best reached by road from Delhi (540km, 12-14 hours) or Chandigarh.",
    best_time: "May to October for adventure, December-February for snow",
  },
};

function getGuide(destination: string, category?: string): Guide | null {
  const key = destination.toLowerCase().replace(/\s+/g, "_");
  return guides[key] || null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let destination = "";
    let category = "";

    // Handle GET requests with query params
    if (req.method === "GET") {
      const url = new URL(req.url);
      destination = url.searchParams.get("destination") || "";
      category = url.searchParams.get("category") || "";
    }
    // Handle POST requests with body
    else if (req.method === "POST") {
      const body = await req.json();
      destination = body.destination || "";
      category = body.category || "";
    }

    if (!destination) {
      return new Response(
        JSON.stringify({ error: "Destination is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const guide = getGuide(destination, category);

    if (!guide) {
      return new Response(
        JSON.stringify({ error: "Guide not found for this destination" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ guide }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
