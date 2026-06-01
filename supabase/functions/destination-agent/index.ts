import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Destination {
  id: string;
  name: string;
  state: string;
  category: string;
  description: string;
  highlights: string[];
  best_time_to_visit: string;
  average_budget: number;
  image_url: string;
  rating: number;
}

const destinations: Destination[] = [
  // Spiritual
  { id: "1", name: "Varanasi", state: "Uttar Pradesh", category: "spiritual", description: "One of the oldest living cities in the world, Varanasi is the spiritual capital of India. Experience the divine Ganga Aarti at the ghats.", highlights: ["Ganga Aarti", "Kashi Vishwanath Temple", "Boat Ride", "Sarnath"], best_time_to_visit: "October - March", average_budget: 25000, image_url: "https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "2", name: "Rishikesh", state: "Uttarakhand", category: "spiritual", description: "The Yoga Capital of the World, nestled in the foothills of the Himalayas along the Ganges River.", highlights: ["Triveni Ghat", "Laxman Jhula", "Yoga Centers", "River Rafting"], best_time_to_visit: "September - November", average_budget: 20000, image_url: "https://images.pexels.com/photos/4230612/pexels-photo-4230612.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.7 },
  { id: "3", name: "Haridwar", state: "Uttarakhand", category: "spiritual", description: "One of the seven holiest Hindu cities, known for the Ganga Aarti at Har Ki Pauri.", highlights: ["Har Ki Pauri", "Mansa Devi Temple", "Ganga Aarti", "Kumbh Mela"], best_time_to_visit: "October - February", average_budget: 18000, image_url: "https://images.pexels.com/photos/16907241/pexels-photo-16907241.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.6 },
  { id: "4", name: "Amritsar", state: "Punjab", category: "spiritual", description: "Home to the Golden Temple, the holiest shrine of Sikhism, known for its stunning golden architecture.", highlights: ["Golden Temple", "Wagah Border", "Jallianwala Bagh", "Langar"], best_time_to_visit: "October - March", average_budget: 22000, image_url: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.9 },
  { id: "5", name: "Bodh Gaya", state: "Bihar", category: "spiritual", description: "The place where Buddha attained enlightenment, one of the most important Buddhist pilgrimage sites.", highlights: ["Mahabodhi Temple", "Bodhi Tree", "Great Buddha Statue", "Thai Temple"], best_time_to_visit: "October - March", average_budget: 15000, image_url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.7 },

  // Adventure
  { id: "6", name: "Manali", state: "Himachal Pradesh", category: "adventure", description: "A popular hill station known for its scenic beauty and adventure activities like trekking and skiing.", highlights: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Paragliding"], best_time_to_visit: "May - October", average_budget: 35000, image_url: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "7", name: "Ladakh", state: "Jammu & Kashmir", category: "adventure", description: "A high-altitude desert with stunning landscapes, pristine lakes, and Buddhist monasteries.", highlights: ["Pangong Lake", "Nubra Valley", "Khardung La", "Monasteries"], best_time_to_visit: "May - September", average_budget: 50000, image_url: "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.9 },
  { id: "8", name: "Rishikesh Rafting", state: "Uttarakhand", category: "adventure", description: "World-class white water rafting destination on the Ganges with rapids ranging from easy to challenging.", highlights: ["River Rafting", "Bungee Jumping", "Camping", "Cliff Jumping"], best_time_to_visit: "September - June", average_budget: 25000, image_url: "https://images.pexels.com/photos/163758/bridge-india-rishikesh-span-163758.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "9", name: "Bir Billing", state: "Himachal Pradesh", category: "adventure", description: "The paragliding capital of India, offering world-class paragliding experiences.", highlights: ["Paragliding", "Tibetan Colony", "Tea Gardens", "Trekking"], best_time_to_visit: "March - May, October - November", average_budget: 20000, image_url: "https://images.pexels.com/photos/163336/pexels-photo-163336.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.6 },
  { id: "10", name: "Spiti Valley", state: "Himachal Pradesh", category: "adventure", description: "A cold desert mountain valley with rugged terrain and ancient monasteries.", highlights: ["Key Monastery", "Chandratal Lake", "Kunzum Pass", "Dhankar Lake"], best_time_to_visit: "June - September", average_budget: 45000, image_url: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.9 },

  // Heritage
  { id: "11", name: "Taj Mahal", state: "Uttar Pradesh", category: "heritage", description: "An iconic UNESCO World Heritage Site and one of the Seven Wonders of the World.", highlights: ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Fatehpur Sikri"], best_time_to_visit: "October - March", average_budget: 20000, image_url: "https://images.pexels.com/photos/160365/pexels-photo-160365.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.9 },
  { id: "12", name: "Jaipur", state: "Rajasthan", category: "heritage", description: "The Pink City, known for its majestic forts, palaces, and vibrant culture.", highlights: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"], best_time_to_visit: "October - March", average_budget: 30000, image_url: "https://images.pexels.com/photos/35969/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "13", name: "Hampi", state: "Karnataka", category: "heritage", description: "Ancient ruins of the Vijayanagara Empire, a UNESCO World Heritage Site.", highlights: ["Virupaksha Temple", "Vittala Temple", "Hampi Bazaar", "Sunset Point"], best_time_to_visit: "October - February", average_budget: 18000, image_url: "https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.7 },
  { id: "14", name: "Udaipur", state: "Rajasthan", category: "heritage", description: "The City of Lakes, known for its romantic lakeside palaces and gardens.", highlights: ["Lake Pichola", "City Palace", "Jag Mandir", "Saheliyon ki Bari"], best_time_to_visit: "September - March", average_budget: 32000, image_url: "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "15", name: "Khajuraho", state: "Madhya Pradesh", category: "heritage", description: "Famous for its stunning group of Hindu and Jain temples with intricate sculptures.", highlights: ["Western Group of Temples", "Light & Sound Show", "Raneh Falls", "Panna National Park"], best_time_to_visit: "October - March", average_budget: 18000, image_url: "https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.6 },

  // Beach
  { id: "16", name: "Goa", state: "Goa", category: "beach", description: "India's most popular beach destination with golden sands, vibrant nightlife, and Portuguese heritage.", highlights: ["Baga Beach", "Anjuna Beach", "Basilica of Bom Jesus", "Dudhsagar Falls"], best_time_to_visit: "November - February", average_budget: 40000, image_url: "https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.7 },
  { id: "17", name: "Varkala", state: "Kerala", category: "beach", description: "A stunning cliff beach destination with mineral springs and spiritual significance.", highlights: ["Varkala Beach", "Janardhana Temple", "Papanasam Beach", "Cliff Side Cafes"], best_time_to_visit: "October - March", average_budget: 25000, image_url: "https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.7 },
  { id: "18", name: "Andaman & Nicobar", state: "Andaman & Nicobar Islands", category: "beach", description: "Pristine tropical islands with crystal clear waters and world-class diving spots.", highlights: ["Radhanagar Beach", "Cellular Jail", "Scuba Diving", "Ross Island"], best_time_to_visit: "October - May", average_budget: 60000, image_url: "https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.9 },
  { id: "19", name: "Kerala Backwaters", state: "Kerala", category: "beach", description: "A network of serene canals and lagoons, best explored on traditional houseboats.", highlights: ["Alleppey Houseboat", "Kumarakom", "Kovalam Beach", "Fort Kochi"], best_time_to_visit: "September - March", average_budget: 35000, image_url: "https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "20", name: "Puducherry", state: "Puducherry", category: "beach", description: "A former French colony with colonial architecture, serene beaches, and spiritual centers.", highlights: ["Promenade Beach", "Auroville", "French Quarter", "Paradise Beach"], best_time_to_visit: "October - March", average_budget: 22000, image_url: "https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.6 },

  // Wildlife
  { id: "21", name: "Jim Corbett", state: "Uttarakhand", category: "wildlife", description: "India's oldest national park, famous for Bengal tigers and diverse wildlife.", highlights: ["Jeep Safari", "Elephant Safari", "Corbett Museum", "River Rafting"], best_time_to_visit: "November - June", average_budget: 30000, image_url: "https://images.pexels.com/photos/162240/tiger-nature-river-sumatra-162240.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "22", name: "Ranthambore", state: "Rajasthan", category: "wildlife", description: "One of the best places to spot tigers in the wild, set amidst ancient ruins.", highlights: ["Tiger Safari", "Ranthambore Fort", "Padam Talao", "Guards Quarters"], best_time_to_visit: "October - June", average_budget: 35000, image_url: "https://images.pexels.com/photos/162240/tiger-nature-river-sumatra-162240.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.9 },
  { id: "23", name: "Kaziranga", state: "Assam", category: "wildlife", description: "UNESCO World Heritage Site, home to two-thirds of the world's one-horned rhinoceros.", highlights: ["Rhino Safari", "Elephant Safari", "Bird Watching", "Orang National Park"], best_time_to_visit: "November - April", average_budget: 28000, image_url: "https://images.pexels.com/photos/162240/tiger-nature-river-sumatra-162240.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.8 },
  { id: "24", name: "Bandipur", state: "Karnataka", category: "wildlife", description: "Part of the Nilgiri Biosphere Reserve with rich biodiversity and tiger population.", highlights: ["Safari", "Gopalaswamy Betta", "Mysore Excursion", "Bird Watching"], best_time_to_visit: "October - May", average_budget: 25000, image_url: "https://images.pexels.com/photos/162240/tiger-nature-river-sumatra-162240.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.7 },
  { id: "25", name: "Sundarbans", state: "West Bengal", category: "wildlife", description: "The largest mangrove forest in the world, home to Royal Bengal Tigers.", highlights: ["Boat Safari", "Sajnekhali Watchtower", "Mangrove Trail", "Tiger Spotting"], best_time_to_visit: "September - March", average_budget: 22000, image_url: "https://images.pexels.com/photos/162240/tiger-nature-river-sumatra-162240.jpeg?auto=compress&cs=tinysrgb&w=800", rating: 4.7 },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    let filteredDestinations = [...destinations];

    // Filter by category
    if (queryParams.category && queryParams.category !== "all") {
      filteredDestinations = filteredDestinations.filter(
        (d) => d.category === queryParams.category
      );
    }

    // Filter by search query
    if (queryParams.search) {
      const searchLower = queryParams.search.toLowerCase();
      filteredDestinations = filteredDestinations.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          d.state.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by state
    if (queryParams.state) {
      filteredDestinations = filteredDestinations.filter(
        (d) => d.state.toLowerCase() === queryParams.state.toLowerCase()
      );
    }

    // Get single destination by ID
    if (queryParams.id) {
      const destination = destinations.find((d) => d.id === queryParams.id);
      if (destination) {
        return new Response(
          JSON.stringify({ destination }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Destination not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sort by rating
    filteredDestinations.sort((a, b) => b.rating - a.rating);

    return new Response(
      JSON.stringify({ destinations: filteredDestinations, total: filteredDestinations.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
