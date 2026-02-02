import { NextResponse } from "next/server"
import { CHALLENGES } from "@/components/playground/data/challenges"
import { AnalysisResult, Challenge } from "@/components/playground/types"

// Interface for the request body
interface AnalyzeRequest {
    prompt: string;
    scenarioId: string;
}

export async function POST(req: Request) {
    try {
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
        // Replacing 'any' with explicit logic
        // We use 'challenge' (was 's') and 'prompt' for scoring

        const lengthScore = Math.min(100, Math.max(0, (prompt.length / 50) * 100))

        // Example check: does the prompt satisfy 'fixer' criteria?
        let hasConstraints = false;
        if (challenge.mode === 'fixer') {
            // Safe access because we checked mode
            hasConstraints = challenge.successCriteria.some((criteria: string) =>
                prompt.toLowerCase().includes(criteria.split(' ')[0].toLowerCase())
            )
        } else if (challenge.mode === 'precision') {
            hasConstraints = challenge.constraints.every(c => { // explicit 'c' type inferred or defined if complex
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
