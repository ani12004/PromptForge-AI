import dotenv from "dotenv";
import { PromptForgeClient } from "promptforge-server-sdk";

dotenv.config();

/**
 * GEMINI EXAMPLE
 * This script demonstrates executing a prompt using the default Gemini provider.
 */

const client = new PromptForgeClient({
    apiKey: process.env.PROMPTFORGE_API_KEY,
    baseURL: "https://prompt-forge-studio.vercel.app" // 👈 Replace with your domain
});

async function main() {
    console.log("🚀 Executing Gemini Prompt...");

    try {
        const result = await client.execute({
            // Use the ID of a prompt saved in the Studio (History tab)
            versionId: "12a5af52-99a0-41dd-a5e9-8a318f23ddb5",
            variables: {
                customer_name: "Anil Suthar",
                issue_type: "Network Outage",
                compensation_amount: "$25"
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
