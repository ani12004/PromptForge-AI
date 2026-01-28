import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200",
    {
        variants: {
            variant: {
                primary: "bg-brand-purple text-white shadow-glow hover:brightness-110 border border-transparent",
                secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md shadow-sm",
                ghost: "text-gray-300 hover:text-white hover:bg-white/5",
                outline: "border border-brand-purple text-white hover:bg-brand-purple/10",
                destructive: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-9 rounded-full px-4 text-xs",
                lg: "h-12 rounded-full px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
