import Image from "next/image"
import Link from "next/link"
import { Sparkles, Twitter, Github, Linkedin, Heart } from "lucide-react"
import { NAV_LINKS } from "@/lib/constants"

export function Footer() {
    return (
        <footer className="border-t border-white/[0.05] bg-[#020204] pt-20 pb-10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative h-12 w-48">
                                <Image
                                    src="/logo_navi.png"
                                    alt="PromptForge"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm text-base">
                            Transforming raw intent into production-grade AI prompts. <br />
                            Built for the next generation of creators.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-3 col-span-6">
                        <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider text-gray-500">Product</h4>
                        <ul className="space-y-4">
                            {NAV_LINKS.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-brand-purple transition-colors text-sm font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}

                        </ul>
                    </div>

                    <div className="md:col-span-3 col-span-6">
                        <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider text-gray-500">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="/terms" className="text-gray-400 hover:text-brand-purple transition-colors text-sm font-medium">Terms of Use</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-brand-purple transition-colors text-sm font-medium">Privacy Policy</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-brand-purple transition-colors text-sm font-medium">Contact Support</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by PromptForge Studio © {new Date().getFullYear()}
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

