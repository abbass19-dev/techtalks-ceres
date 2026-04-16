

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") ?? "";
  if (!query.trim()) return NextResponse.json({ suggestions: [] });

  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=8&api_key=${process.env.USDA_API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } }); 
    if (!res.ok) return NextResponse.json({ suggestions: [] }, { status: res.status });

    const data = await res.json();

    
    const seen = new Set<string>();
    const suggestions: string[] = [];
    for (const food of data.foods ?? []) {
      const desc: string = food.description ?? "";
      const key = desc.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push(desc.split(",")[0].trim());
      }
    }

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
