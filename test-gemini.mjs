import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Read .env.local manually to get the key
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

console.log("Checking Gemini API Models...");
console.log("API Key found: " + (apiKey ? "Yes" : "No"));

const genAI = new GoogleGenerativeAI(apiKey);

async function testGeneration() {
    console.log(`\nTesting generation with gemini-2.0-flash...`);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Say 'Hello' if you can hear me.");
        const response = await result.response;
        console.log(`✅ SUCCESS: gemini-2.0-flash responded: "${response.text().trim()}"`);
    } catch (error) {
        console.log(`❌ FAILED: Generation failed.`);
        console.log(`   Error Message: ${error.message}`);
        if (error.cause) console.log(`   Cause: ${error.cause}`);
    }
}

async function run() {
    await testGeneration();
}

run();
