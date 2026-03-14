export default async function handler(req, res) {
  console.log('method:', req.method);
  console.log('body:', JSON.stringify(req.body));
  console.log('raw body type:', typeof req.body);

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { mood, systemPrompt } = body || {};

  console.log('mood:', mood);
  console.log('systemPrompt:', systemPrompt ? 'present' : 'missing');

  if (!mood || !systemPrompt) {
    return res.status(400).json({ error: 'Missing fields', body: req.body });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Mood: ${mood}` }]
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
