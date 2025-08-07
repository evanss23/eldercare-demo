// File: src/app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // We get the user's message from the request
    const body = await request.json();
    const userMessage = body.data?.[0] || "No message provided";

    console.log("⚠️ USING FALLBACK API! Real backend is likely down.");

    // Create a simple, hardcoded response that mimics your real API's structure
    const fallbackResponse = {
      ai_response: `This is a fallback response for: "${userMessage}". The real AI is currently unavailable.`,
      emotion: 'calm',
      wellness_score: 75,
      safety_status: {
        level: 'yellow', // Use a 'caution' color to indicate it's a fallback
        message: 'Using Fallback AI',
      },
      chat_history: [],
    };

    // Important: We wrap our response in a 'data' array, just like the real Gradio API
    return NextResponse.json({
      data: [fallbackResponse],
    });

  } catch (error) {
    console.error("Fallback API Error:", error);
    return NextResponse.json(
      { error: "Error in fallback API." },
      { status: 500 }
    );
  }
}