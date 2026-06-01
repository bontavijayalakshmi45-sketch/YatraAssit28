import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatRequest {
  message: string;
  language: string;
  userId?: string;
  image?: string;
}

interface Destination {
  name: string;
  state: string;
  category: string;
  description: string;
}

const destinations: Destination[] = [
  { name: "Varanasi", state: "Uttar Pradesh", category: "spiritual", description: "One of the oldest living cities, spiritual capital of India" },
  { name: "Rishikesh", state: "Uttarakhand", category: "spiritual", description: "Yoga capital of the world, gateway to the Himalayas" },
  { name: "Golden Temple", state: "Punjab", category: "spiritual", description: "Holiest shrine of Sikhism, known for its golden architecture" },
  { name: "Manali", state: "Himachal Pradesh", category: "adventure", description: "Popular hill station for trekking and adventure sports" },
  { name: "Rishikesh Rafting", state: "Uttarakhand", category: "adventure", description: "World-class white water rafting destination" },
  { name: "Ladakh", state: "Jammu & Kashmir", category: "adventure", description: "High-altitude desert with stunning landscapes" },
  { name: "Taj Mahal", state: "Uttar Pradesh", category: "heritage", description: "Iconic UNESCO World Heritage Site, symbol of love" },
  { name: "Hampi", state: "Karnataka", category: "heritage", description: "Ancient Vijayanagara empire ruins, UNESCO site" },
  { name: "Jaipur", state: "Rajasthan", category: "heritage", description: "Pink City with majestic forts and palaces" },
  { name: "Goa", state: "Goa", category: "beach", description: "Famous beaches, vibrant nightlife, Portuguese heritage" },
  { name: "Kerala", state: "Kerala", category: "beach", description: "Backwaters, beaches, and serene coastal beauty" },
  { name: "Andaman", state: "Andaman & Nicobar", category: "beach", description: "Pristine beaches with crystal clear waters" },
  { name: "Jim Corbett", state: "Uttarakhand", category: "wildlife", description: "India's oldest national park, famous for tigers" },
  { name: "Ranthambore", state: "Rajasthan", category: "wildlife", description: "Best place to spot tigers in the wild" },
  { name: "Kaziranga", state: "Assam", category: "wildlife", description: "UNESCO site, home to one-horned rhinoceros" },
];

function getAIResponse(message: string, language: string, hasImage: boolean): { message: string; data?: any } {
  const lowerMessage = message.toLowerCase();

  // Handle image queries
  if (hasImage) {
    if (language === "hindi") {
      return { message: "मुझे आपकी छवि दिखाई दे रही है! यह एक सुंदर यात्रा स्थल की तरह दिखता है। क्या आप इस स्थान के बारे में अधिक जानकारी चाहते हैं? मैं आपको यात्रा योजना, बजट अनुमान, और सर्वोत्तम समय के बारे में बता सकता हूं।" };
    }
    if (language === "telugu") {
      return { message: "మీ చిత్రం చూడగలను! ఇది ఒక అందమైన పర్యాటక ప్రదేశంగా కనిపిస్తోంది. మీరు ఈ స్థలం గురించి మరింత సమాచారం కోరుకుంటున్నారా? ప్రయాణ ప్రణాళిక, బడ్జెట్ అంచనాలు, మరియు ఉత్తమ సమయాన్ని అందించగలను." };
    }
    return {
      message: "I can see your image! It looks like a beautiful travel destination. Would you like me to provide information about this place? I can help you with:\n\n• Travel planning and itineraries\n• Budget estimates\n• Best time to visit\n• Nearby attractions\n• How to reach\n\nWhat would you like to know?"
    };
  }

  // Greeting responses
  if (lowerMessage.match(/^(hi|hello|hey|namaste|नमस्ते|నమస్కారం)/)) {
    if (language === "hindi") {
      return { message: "नमस्ते! मैं यात्रा असिस्टेंट हूं। मैं आपकी भारत की यात्रा की योजना बनाने में मदद कर सकता हूं। कृपया अपना प्रश्न पूछें।" };
    }
    if (language === "telugu") {
      return { message: "నమస్కారం! నేను యాత్రా సహాయకుడిని. భారతదేశంలో మీ ప్రయాణాన్ని ప్లాన్ చేయడంలో సహాయం చేయగలను." };
    }
    return { message: "Namaste! I'm your Yatra Assistant. I can help you plan your trip to India with personalized recommendations. What would you like to know?" };
  }

  // Destination queries
  if (lowerMessage.includes("destination") || lowerMessage.includes("place") || lowerMessage.includes("visit")) {
    const categories = ["spiritual", "adventure", "heritage", "beach", "wildlife"];
    const matchingDestinations: Destination[] = [];

    categories.forEach(cat => {
      if (lowerMessage.includes(cat)) {
        matchingDestinations.push(...destinations.filter(d => d.category === cat).slice(0, 3));
      }
    });

    if (matchingDestinations.length > 0) {
      const destList = matchingDestinations.map(d => `${d.name}, ${d.state}`).join("\n• ");
      return {
        message: `Here are some great destinations for you:\n\n• ${destList}\n\nWould you like more details about any of these places?`,
        data: { destinations: matchingDestinations }
      };
    }

    return {
      message: "India has amazing destinations across different categories:\n\n• Spiritual: Varanasi, Rishikesh, Golden Temple\n• Adventure: Manali, Ladakh, Rishikesh\n• Heritage: Taj Mahal, Hampi, Jaipur\n• Beach: Goa, Kerala, Andaman\n• Wildlife: Jim Corbett, Ranthambore, Kaziranga\n\nWhich type of destination interests you?",
      data: { destinations: destinations.slice(0, 5) }
    };
  }

  // Budget queries
  if (lowerMessage.includes("budget") || lowerMessage.includes("cost") || lowerMessage.includes("expense")) {
    return {
      message: "I can help you plan your budget! The budget calculator can provide a detailed breakdown for:\n\n• Accommodation (35-40% of budget)\n• Transportation (15-20%)\n• Food (15-20%)\n• Activities (15-20%)\n• Miscellaneous (10%)\n\nYou can use the Budget Calculator page to get personalized estimates. Would you like me to help estimate costs for a specific destination?"
    };
  }

  // Itinerary queries
  if (lowerMessage.includes("itinerary") || lowerMessage.includes("plan") || lowerMessage.includes("schedule")) {
    return {
      message: "I can help create a personalized itinerary for you! Our AI Itinerary Generator considers:\n\n• Your destination preferences\n• Travel dates and duration\n• Budget constraints\n• Travel type (spiritual, adventure, heritage, beach, wildlife)\n\nYou can use the Itinerary page to generate a complete day-by-day plan. What destination are you planning to visit?"
    };
  }

  // Best time to visit
  if (lowerMessage.includes("best time") || lowerMessage.includes("when to visit") || lowerMessage.includes("season")) {
    return {
      message: "The best time to visit varies by region:\n\n• North India (Rajasthan, Delhi, Agra): October to March\n• South India (Kerala, Tamil Nadu): November to February\n• Himalayas (Manali, Ladakh): May to September\n• Goa & Beaches: November to February\n• Wildlife Parks: October to June\n\nWhich destination are you interested in?"
    };
  }

  // Default response
  if (language === "hindi") {
    return { message: "मैं आपकी भारत की यात्रा की योजना में मदद कर सकता हूं। आप पूछ सकते हैं:\n\n• गंतव्य स्थानों के बारे में\n• बजट अनुमान\n• यात्रा कार्यक्रम\n• यात्रा का सर्वोत्तम समय" };
  }
  if (language === "telugu") {
    return { message: "నేను మీ భారత పర్యటన ప్రణాళికలో సహాయం చేయగలను. మీరు అడగవచ్చు:\n\n• గమ్యస్థానాల గురించి\n• బడ్జెట్ అంచనాలు\n• ప్రయాణ ప్రణాళిక" };
  }
  return {
    message: "I can help you plan your trip to India! You can ask me about:\n\n• Destinations and places to visit\n• Budget estimates and calculations\n• Itinerary planning and schedules\n• Best time to visit different regions\n• Travel tips and recommendations\n\nWhat would you like to know?"
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, language, userId, image }: ChatRequest = await req.json();

    if (!message && !image) {
      return new Response(
        JSON.stringify({ error: "Message or image is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = getAIResponse(message || "", language || "english", !!image);

    return new Response(
      JSON.stringify({ message: response.message, data: response.data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
