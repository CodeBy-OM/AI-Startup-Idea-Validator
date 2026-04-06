import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert startup consultant. Analyze the given startup idea and return ONLY a valid JSON object with no markdown, no backticks, no explanation.

The JSON must have exactly these fields:
{
  "problem": "2-3 sentence problem description",
  "customer": {
    "primary": "Primary customer segment",
    "pain_points": ["point 1", "point 2", "point 3"],
    "willingness_to_pay": "Low/Medium/High with reason"
  },
  "market": {
    "size": "TAM estimate with numbers",
    "growth_rate": "Annual growth % with context",
    "maturity": "Emerging or Growing or Mature or Declining",
    "summary": "2-sentence market overview"
  },
  "competitors": [
    { "name": "Name", "differentiation": "How startup differs" },
    { "name": "Name", "differentiation": "How startup differs" },
    { "name": "Name", "differentiation": "How startup differs" }
  ],
  "tech_stack": ["tech1", "tech2", "tech3", "tech4", "tech5"],
  "risk_level": "Low",
  "risk_factors": ["risk 1", "risk 2", "risk 3"],
  "profitability_score": 65,
  "justification": "3-4 sentence explanation of score and key success factors",
  "go_to_market": "First 90-day GTM strategy in 2-3 sentences",
  "verdict": "Promising"
}

Rules:
- risk_level must be exactly: Low, Medium, or High
- verdict must be exactly: Strong Buy, Promising, Risky, or Needs Pivot
- profitability_score must be integer 0-100
- Return ONLY raw JSON. No markdown. No backticks.`;

export async function analyzeIdea(title, description) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this startup:\n\nTitle: ${title}\nDescription: ${description}` }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim();

  if (!raw) throw new Error('Groq returned empty response');

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Invalid JSON from Groq: ${raw.slice(0, 300)}`);
  }
}