import dotenv from "dotenv";
import { PromptForgeClient } from "promptforge-server-sdk";

dotenv.config();

/**
 * NVIDIA EXAMPLE
 * This script demonstrates executing a prompt using high-performance NVIDIA models.
 */

const client = new PromptForgeClient({
    apiKey: process.env.PROMPTFORGE_API_KEY,
    baseURL: "https://prompt-forge-studio.vercel.app" // 👈 Replace with your domain
});

async function main() {
    console.log("🚀 Executing NVIDIA Pitch...");

    try {
        const result = await client.execute({
            // Use the ID of a prompt configured with an NVIDIA model
            versionId: "8571cc38-aec3-4590-b9db-5e3d67374061",
            variables: {
                ceo_name: "Jensen",
                project_name: "Prompt Forge Studio",
                your_name: "Anil Suthar",
                goal: "democratize prompt engineering",
                specific_benefit: "Nemotron-Ultra-253B API credits",
                impact: "empower 100,000 developers"
            }
        });

        if (result.success) {
            console.log("✅ Success!");
            console.log("Output:", result.data);
        } else {
            console.log("❌ Error:", result.error);
        }
    } catch (err) {
        console.error("🔥 Fatal Error:", err.message);
    }
}

main();
