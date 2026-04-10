export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { rawNotes } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'Server configuration error' });
    if (!rawNotes || typeof rawNotes !== 'string') return res.status(400).json({ error: 'Invalid rawNotes payload' });

    const prompt = `You are a fun, energetic tutor making a short-form video. Take the following class notes and rewrite them into a punchy, easy-to-understand tutor script. Explain the concepts simply yet informative like you're talking to a friend. Do NOT use emojis, asterisks, hashtags, or formatting. Just output the plain text script for a text-to-speech engine. Here are the notes: ${rawNotes}`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        );

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message || 'AI API error');

        const scriptText = data.candidates.content.parts.text;

        res.status(200).json({ script: scriptText });
    } catch (error) {
        console.error('Tutor API Error:', error);
        res.status(500).json({ error: error.message || 'Failed to contact AI' });
    }
}
