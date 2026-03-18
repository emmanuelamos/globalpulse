import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PERSONAS = {
  MARCUS: "You are Marcus, a steady, authoritative lead news anchor. You are professional, objective, and calm. Use phrases like 'Reporting live,' and 'In other developments.'",
  ELENA: "You are Dr. Elena Reyes, a serious, velvety-voiced expert. You analyze data and weather with clinical precision. You are no-nonsense and highly intelligent.",
  JAX: "You are Jax, a brash, aggressive, and highly opinionated shock-jock. You think everything is a scam or ridiculous. You yell (in text), use sarcasm, and talk over the news.",
  RILEY: "You are Riley, a charming, casual entertainment reporter. You love celebrity tea and trending drama. Use 'OMG,' 'The tea is,' and talk like you're gossiping with a best friend.",
  VICTORIA: "You are Victoria, a bright and professional co-anchor. You provide a balanced, positive perspective on stories."
};

export async function generateAiscript(story: any, personaKey: keyof typeof PERSONAS): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Fast and cheap for scripts
    messages: [
      { role: "system", content: `${PERSONAS[personaKey]} Your goal is to take a news summary and turn it into a 30-45 second radio script segment. Don't use stage directions like [Music Fades]. Just output the spoken words.` },
      { role: "user", content: `Here is the story: ${story.title}. Summary: ${story.summary}. AI Analysis: ${story.aiSummary || 'None'}. Make it sound like a natural radio segment.` }
    ],
    max_tokens: 300,
    temperature: 0.8, // High enough for personality
  });

  return response.choices[0].message.content || "Sorry, we're having technical difficulties with this segment.";
}

// server/services/ScriptWriter.ts

export async function generateSegmentBlocks(story: any, personaKey: keyof typeof PERSONAS): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: `${PERSONAS[personaKey]} Break your segment into 3 distinct, short paragraphs. 
        Each paragraph should be a complete thought. 
        Do not use stage directions. Output as a JSON array of strings.` 
      },
      { role: "user", content: `Story: ${story.title}. Summary: ${story.summary}.` }
    ],
    response_format: { type: "json_object" }
  });

  const data = JSON.parse(response.choices[0].message.content ?? "{}");
  return data.paragraphs; // e.g., ["Intro about the planet", "The science part", "The closing joke"]
}

// server/services/ScriptWriter.ts

export async function generateCallInScript(
  personaKey: keyof typeof PERSONAS,
  callerName: string,
  callerTranscript: string,
  storyContext: any
): Promise<{ intro: string; outro: string }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: `${PERSONAS[personaKey]} You are hosting a live radio show. A listener named ${callerName} just called in. 
        You are about to play their 10-second voice clip. 
        Then, you will respond to what they said.
        
        Output your response in JSON format:
        {
          "intro": "Your lines leading up to the clip (e.g., 'We've got Sarah on the line...')",
          "outro": "Your reaction after hearing their take."
        }` 
      },
      { 
        role: "user", 
        content: `The story being discussed: ${storyContext.title}. 
        The caller said: "${callerTranscript}". 
        Give me the intro and the reaction.` 
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = JSON.parse(response.choices[0].message.content || "{}");
  return {
    intro: content.intro || `Let's hear from ${callerName}.`,
    outro: content.outro || `Interesting point, ${callerName}. Moving on.`
  };
}

// server/services/ScriptWriter.ts

export async function generateReactionAndNextBlock(
  personaKey: keyof typeof PERSONAS,
  callerTranscript: string,
  story: any,
  isLastBlock: boolean
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: `${PERSONAS[personaKey]} A caller just said: "${callerTranscript}". 
        First, react to them briefly in your persona. 
        Then, transition back to the story: ${story.title}.
        ${isLastBlock ? "Wrap up the segment with a final thought." : "Give the next piece of info about the story."}
        Keep it under 40 words total. No stage directions.` 
      }
    ],
    temperature: 0.8,
  });

  return response.choices[0].message.content ?? "Anyway, back to the news.";
}