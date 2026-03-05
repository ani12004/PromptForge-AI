import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { CHALLENGES } from "@/components/playground/data/challenges"
import { AnalysisResult, Challenge } from "@/components/playground/types"
import { checkRateLimit } from "@/lib/rate-limit"

// Interface for the request body
interface AnalyzeRequest {
    prompt: string;
    scenarioId: string;
}

export async function POST(req: Request) {
    try {
        // SECURITY: Require authentication
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        // SECURITY: Rate limit — 30 requests per minute per user
        const isAllowed = await checkRateLimit(`playground_analyze_${userId}`, 30, 60);
        if (!isAllowed) {
            return new Response("Rate limit exceeded. Please slow down.", { status: 429 });
        }

        const body: AnalyzeRequest = await req.json()
        const { prompt, scenarioId } = body

        if (!prompt || !scenarioId) {
            return new Response("Missing prompt or scenarioId", { status: 400 })
        }

        // Find challenge by ID using proper typing
        const challenge: Challenge | undefined = CHALLENGES.find((c: Challenge) => c.id === scenarioId)

        if (!challenge) {
            return new Response("Invalid scenario", { status: 400 })
        }

        // --- HEURISTIC ANALYSIS SIMULATION ---
        const lengthScore = Math.min(100, Math.max(0, (prompt.length / 50) * 100))

        let hasConstraints = false;
        if (challenge.mode === 'fixer') {
            hasConstraints = challenge.successCriteria.some((criteria: string) =>
                prompt.toLowerCase().includes(criteria.split(' ')[0].toLowerCase())
            )
        } else if (challenge.mode === 'precision') {
            hasConstraints = challenge.constraints.every(c => {
                if (c.type === 'contains') return prompt.includes(String(c.value));
                return true;
            })
        }

        const evaluation: AnalysisResult = {
            overallScore: hasConstraints ? 85 : 45,
            metrics: [
                {
                    name: "Intent Precision",
                    score: prompt.length > 20 ? 90 : 40,
                    description: "How clearly the goal is defined."
                },
                {
                    name: "Context Quality",
                    score: prompt.includes("context") || prompt.length > 50 ? 80 : 30,
                    description: "Sufficient background information provided."
                },
                {
                    name: "Constraint Adherence",
                    score: hasConstraints ? 95 : 20,
                    description: "Follows specific negative or format constraints."
                }
            ],
            strengths: [
                "Clear active voice used.",
                hasConstraints ? "Good adherence to length constraints." : "Attempted to define the task."
            ],
            weaknesses: [
                !hasConstraints ? "Failed to explicitly mention constraints." : "Could be more concise.",
                "Lacks 'Chain of Thought' instructions."
            ],
            improvements: `[Improved] ${challenge.title}\n\nReview: \n${prompt}`,
            tips: [
                "Always assign a Persona (e.g., 'Act as a lawyer').",
                "Use delimiters like quotes or XML tags for data."
            ]
        }

        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500))

        return NextResponse.json({
            success: true,
            evaluation
        })

    } catch (error) {
        console.error("Playground API Error:", error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
