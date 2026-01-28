"use client"

import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, Github } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import Link from "next/link"

export default function SignupPage() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            await signUp.create({
                emailAddress: email,
                password,
            })

            // Prepare email verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
            setPendingVerification(true)
        } catch (err: any) {
            console.error("Signup error", err)
            setError(err.errors?.[0]?.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                router.push("/dashboard")
            } else {
                console.error("Verification incomplete", result)
                setError("Verification failed. Please check the code.")
            }
        } catch (err: any) {
            console.error("Verification error", err)
            setError(err.errors?.[0]?.message || "Verification failed.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGitHubSignup = async () => {
        if (!isLoaded) return
        setIsLoading(true)
        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            })
        } catch (err: any) {
            console.error("GitHub Signup error", err)
            setError(err.errors?.[0]?.message || "GitHub signup failed.")
            setIsLoading(false)
        }
    }

    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050508] py-12 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {pendingVerification ? "Verify Email" : "Create Account"}
                    </h1>
                    <p className="text-gray-400">
                        {pendingVerification
                            ? "Check your email for the verification code"
                            : "Join PromptForge to master AI communication"
                        }
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl">
                    <div className="space-y-4">
                        {!pendingVerification && (
                            <>
                                <Button
                                    variant="secondary"
                                    className="w-full h-11 flex items-center justify-center gap-2"
                                    onClick={handleGitHubSignup}
                                    disabled={isLoading}
                                >
                                    <Github className="h-5 w-5" />
                                    Continue with GitHub
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/10" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-[#0b0b0e] px-2 text-gray-500">Or sign up with email</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {!pendingVerification ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Email address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />

                                {error && (
                                    <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerify} className="space-y-4">
                                <Input
                                    label="Verification Code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />

                                {error && (
                                    <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        "Verify Email"
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {!pendingVerification && (
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link href="/login" className="text-brand-purple hover:text-brand-violet font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
