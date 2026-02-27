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
import { UserMenu } from "@/components/layout/UserMenu"
import { SignedIn, SignedOut } from "@clerk/nextjs"

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
                    "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
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
                        <Link href="/" className="flex items-center gap-3 group z-40">
                            <div className="relative h-10 w-32 md:h-14 md:w-60 transition-all duration-300">
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
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "relative px-5 py-2 text-sm font-medium transition-colors duration-300 rounded-full z-10",
                                            isActive ? "text-white" : "text-gray-400 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute inset-0 bg-white/10 rounded-full shadow-inner"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3 z-40">
                            <SignedOut>
                                <Link href="/login">
                                    <Button variant="ghost" className="hidden sm:inline-flex text-gray-300 hover:text-white hover:bg-white/5">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/signup" className="hidden md:block">
                                    <Button className="h-10 px-5 bg-white text-brand-dark hover:bg-gray-100 font-semibold shadow-xl shadow-white/5 border-0 rounded-xl">
                                        Get Started
                                    </Button>
                                </Link>
                            </SignedOut>
                            <div className="relative z-50">
                                <SignedIn>
                                    <UserMenu direction="down" />
                                </SignedIn>
                            </div>

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
                        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-3xl md:hidden flex flex-col pt-32 px-6"
                    >
                        <nav className="flex flex-col gap-6">
                            {NAV_LINKS.map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
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
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="mt-8 flex flex-col gap-4"
                            >
                                <Link href="/signup" className="w-full">
                                    <Button className="w-full justify-center h-12 text-lg font-semibold bg-brand-purple hover:bg-brand-purple/90" size="lg">
                                        Get Started Now
                                    </Button>
                                </Link>
                                <Link href="/login" className="w-full">
                                    <Button variant="secondary" className="w-full justify-center h-12 text-lg bg-white/5 hover:bg-white/10 border-white/10" size="lg">
                                        Log in
                                    </Button>
                                </Link>
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

