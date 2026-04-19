import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an experienced trial attorney specializing in jury selection and voir dire strategy. Generate a comprehensive, strategically-structured voir dire question bank for the case described:

Organize questions as:

**PHASE 1: RAPPORT BUILDING**
- Opening remarks and juror comfort questions
- Background/occupation questions (establish credibility baseline)

**PHASE 2: PREJUDICES & BIASES SCREENING**
Questions about attitudes toward:
- [Party type: plaintiff/defendant/accused]
- [Subject matter: injury/business/criminal/etc.]
- Key fact patterns in the case
- Legal process beliefs

**PHASE 3: EXPOSURE & MEDIA BIAS**
- News consumption about this case
- Prior knowledge of parties or issues
- Social media exposure
- Opinion formation from media

**PHASE 4: LIFE EXPERIENCE CORRELATES**
- Personal experiences with similar situations
- Family member experiences with legal system
- Professional exposure to similar industries/activities

**PHASE 5: ATTITUDES TOWARD KEY ISSUES**
- Specific fact-dependent questions targeting key dispute elements
- Damages/liability beliefs
- Credibility assessment tendencies
- Comparative fault views

**PHASE 6: COMMITMENT & HONESTY**
- Questions designed to identify jurors likely to be swayed by others
- Hard vs. soft thinkers
- Whistleblower/independence tendencies

For each question include:
- Question text
- What to listen for in responses
- Follow-up probes
- Strike recommendation rationale

Note: Reference jurisdiction-specific voir dire rules (time limits, scope).`,
        },
        {
          role: "user",
          content: `Build jury selection voir dire questions for:\n\n${prompt}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "No response from model" }, { status: 500 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
