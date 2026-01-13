import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const country = searchParams.get("country") || "us";
  const category = searchParams.get("category") || "";

  let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;

  if (category) {
    url += `&category=${category}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
