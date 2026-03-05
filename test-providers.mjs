import fs from 'fs';
import path from 'path';

// Minimal .env loader
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line.includes('='))
        .map(line => {
            const [key, ...val] = line.split('=');
            return [key.trim(), val.join('=').trim()];
        })
);

const providers = [
    {
        name: 'Gemini',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        body: (p) => ({
            contents: [{ parts: [{ text: p }] }]
        }),
        headers: { 'x-goog-api-key': env.GEMINI_API_KEY },
        parser: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text
    },
    {
        name: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        apiKey: env.GROQ_API_KEY,
        body: (p) => ({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: p }]
        }),
        parser: (data) => data.choices?.[0]?.message?.content
    },
    {
        name: 'NVIDIA',
        url: 'https://integrate.api.nvidia.com/v1/chat/completions',
        apiKey: env.NVIDIA_API_KEY,
        body: (p) => ({
            model: 'nvidia/nemotron-3-nano-30b-a3b',
            messages: [{ role: 'user', content: p }]
        }),
        parser: (data) => data.choices?.[0]?.message?.content
    }
];

async function testProviders() {
    const prompt = "Say 'SUCCESS' if you can read this.";
    console.log(`Testing with prompt: "${prompt}"\n`);

    for (const provider of providers) {
        console.log(`[Testing ${provider.name}]...`);
        try {
            const key = provider.apiKey || (provider.headers ? provider.headers['x-goog-api-key'] : null);
            if (!key || key === 'undefined') {
                console.error(`❌ ${provider.name} Failed: API Key not found in env`);
                continue;
            }
            // console.log(`  Key snippet: ${key.slice(0, 5)}...`);

            const headers = { 'Content-Type': 'application/json' };
            if (provider.apiKey) headers['Authorization'] = `Bearer ${provider.apiKey}`;
            if (provider.headers) Object.assign(headers, provider.headers);

            const res = await fetch(provider.url, {
                method: 'POST',
                headers,
                body: JSON.stringify(provider.body(prompt))
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error(`❌ ${provider.name} Failed: ${res.status} - ${errText.slice(0, 100)}...`);
                continue;
            }

            const data = await res.json();
            const output = provider.parser(data);
            console.log(`✅ ${provider.name} Response: ${output.trim()}\n`);
        } catch (err) {
            console.error(`❌ ${provider.name} Error:`, err.message);
        }
    }
}

testProviders();
