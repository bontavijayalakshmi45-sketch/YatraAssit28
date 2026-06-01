import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BudgetRequest {
  destination: string;
  days: number;
  travelersCount: number;
  travelType: string;
  budget: number;
}

interface BudgetBreakdown {
  accommodation: number;
  transportation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
  currency: string;
}

function calculateBudget(request: BudgetRequest): { budget: BudgetBreakdown; tips: string[] } {
  const { budget, days, travelersCount, travelType } = request;

  // Base allocation percentages adjusted by travel type
  const allocationFactors = {
    spiritual: { accommodation: 0.30, transportation: 0.20, food: 0.20, activities: 0.15, miscellaneous: 0.15 },
    adventure: { accommodation: 0.25, transportation: 0.25, food: 0.15, activities: 0.25, miscellaneous: 0.10 },
    heritage: { accommodation: 0.35, transportation: 0.20, food: 0.20, activities: 0.15, miscellaneous: 0.10 },
    beach: { accommodation: 0.35, transportation: 0.20, food: 0.20, activities: 0.15, miscellaneous: 0.10 },
    wildlife: { accommodation: 0.30, transportation: 0.25, food: 0.15, activities: 0.20, miscellaneous: 0.10 },
  };

  const factors = allocationFactors[travelType as keyof typeof allocationFactors] || allocationFactors.heritage;

  const breakdown: BudgetBreakdown = {
    accommodation: Math.round(budget * factors.accommodation),
    transportation: Math.round(budget * factors.transportation),
    food: Math.round(budget * factors.food),
    activities: Math.round(budget * factors.activities),
    miscellaneous: Math.round(budget * factors.miscellaneous),
    total: budget,
    currency: "INR",
  };

  const tips = [
    "Book accommodations in advance for better deals and discounts",
    "Use local transport like buses and trains to save money",
    "Try local street food for authentic experiences at lower costs",
    "Travel during off-peak season for significant savings on hotels",
    "Visit free attractions like temples, markets for cultural experiences",
    "Book group tours for better rates on activities and safaris",
    "Carry a reusable water bottle to avoid buying bottled water",
    "Negotiate prices at local markets for souvenirs",
    "Consider homestays for authentic experiences at lower costs",
    "Use travel apps to compare prices and find best deals",
  ];

  // Return 6 random tips
  const selectedTips = tips.sort(() => 0.5 - Math.random()).slice(0, 6);

  return { budget: breakdown, tips: selectedTips };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const request: BudgetRequest = await req.json();

    if (!request.destination) {
      return new Response(
        JSON.stringify({ error: "Destination is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = calculateBudget(request);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to calculate budget" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
