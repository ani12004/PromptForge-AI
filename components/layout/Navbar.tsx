"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "@/lib/constants"
import { Button } from "@/components/ui/Button"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    scrolled ? "py-4" : "py-6"
                )}
            >
                <div className="container mx-auto px-6 max-w-7xl">
                    <div
                        className={cn(
                            "mx-auto flex h-16 items-center justify-between rounded-2xl border transition-all duration-300 px-4 sm:px-6",
                            scrolled
                                ? "bg-brand-dark/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/20"
                                : "bg-transparent border-transparent"
                        )}
                    >
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group z-50">
                            <div className="relative h-10 w-48">
                                <Image
                                    src="/logo_navi.png"
                                    alt="PromptForge"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-full p-1 border border-white/[0.05] backdrop-blur-md">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                                        pathname === link.href
                                            ? "text-white bg-white/10 shadow-inner"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3 z-50">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="ghost" className="hidden sm:inline-flex text-gray-300 hover:text-white hover:bg-white/5">
                                        Log in
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button className="h-10 px-5 bg-white text-brand-dark hover:bg-gray-100 font-semibold shadow-xl shadow-white/5 border-0 rounded-xl">
                                        Get Started
                                    </Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-9 w-9 border-2 border-white/20"
                                        }
                                    }}
                                />
                            </SignedIn>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="ml-2 flex h-10 w-10 items-center justify-center rounded-full text-gray-300 hover:bg-white/10 hover:text-white md:hidden transition-colors"
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-3xl md:hidden flex flex-col pt-32 px-6"
                    >
                        <nav className="flex flex-col gap-6">
                            {NAV_LINKS.map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "flex items-center justify-between text-3xl font-medium tracking-tight py-2 border-b border-white/5",
                                            pathname === link.href ? "text-white" : "text-gray-500"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                        <ChevronRight className={cn(
                                            "h-6 w-6 transition-transform",
                                            pathname === link.href ? "text-brand-purple rotate-90" : "text-gray-700"
                                        )} />
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 flex flex-col gap-4"
                            >
                                <Button className="w-full justify-center h-12 text-lg font-semibold bg-brand-purple hover:bg-brand-purple/90" size="lg">
                                    Get Started Now
                                </Button>
                                <Button variant="secondary" className="w-full justify-center h-12 text-lg bg-white/5 hover:bg-white/10 border-white/10" size="lg">
                                    Log in
                                </Button>
                            </motion.div>
                        </nav>

                        {/* Background Splatter */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-purple/20 blur-[100px] rounded-full pointer-events-none -z-10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

