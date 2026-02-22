import { PromptForgeClient } from './promptforge-sdk/dist/index.mjs';
import fs from 'fs';
import path from 'path';

import dotenv from "dotenv";
import { PromptForgeClient } from "promptforge-server-sdk";

dotenv.config();

/**
 * PROMPT FORGE STUDIO - GETTING STARTED
 * 
 * 1. Initialize with your API Key and your Vercel URL.
 * 2. Use a Version ID from your Studio History.
 * 3. Provide variables matching your {{template_labels}}.
 * 
 * To swap between Gemini and NVIDIA prompts, simply change the "Model" setting
 * within your PromptForge Studio project for the specific version you are using.
 * The SDK will automatically use the configured model.
 */

const client = new PromptForgeClient({
    apiKey: process.env.PROMPTFORGE_API_KEY,
    baseURL: "https://prompt-forge-studio.vercel.app" // 👈 ALWAYS update this to your live domain
});

async function run() {
    console.log("🚀 Running PromptForge Execution...");

    // Replace this with a Version ID from your PromptForge Studio project.
    // You can find Version IDs in the "History" tab of your project.
    const examplePromptId = "12a5af52-99a0-41dd-a5e9-8a318f23ddb5"; // Example: Simple Email template

    try {
        const result = await client.execute({
            versionId: examplePromptId,
            variables: {
                customer_name: "Anil Suthar",
                issue_type: "Database Sync Delay",
                compensation_amount: "1,000 Free Credits"
            }
        });

        if (result.success) {
            console.log("✅ EXECUTION SUCCESS");
            console.log("Output Content:\n", result.data);
            console.log("\nMeta Specs:", result.meta);
        } else {
            console.log("❌ EXECUTION FAILED:", result.error);
        }
    } catch (err) {
        console.error("🔥 SYSTEM ERROR:", err.message);
    }
}

run();
