import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassCardVariants = cva(
    "relative overflow-hidden rounded-3xl backdrop-blur-xl transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-xl",
                premium: "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl hover:shadow-purple-500/20 hover:border-white/30",
                subscription: "bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] shadow-lg hover:shadow-xl hover:border-accent-primary/30 hover:scale-[1.02]",
                stat: "bg-gradient-to-br from-accent-primary/20 to-accent-secondary/10 border border-accent-primary/30 shadow-lg",
                minimal: "bg-white/5 border border-white/10 shadow-md hover:bg-white/10",
            },
            glow: {
                true: "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
                false: "",
            },
            interactive: {
                true: "cursor-pointer hover:-translate-y-1 active:scale-98",
                false: "",
            }
        },
        defaultVariants: {
            variant: "default",
            glow: false,
            interactive: false,
        },
    }
)

export interface GlassCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
    children: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant, glow, interactive, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(glassCardVariants({ variant, glow, interactive, className }))}
                {...props}
            >
                {children}
            </div>
        )
    }
)
GlassCard.displayName = "GlassCard"

// Gradient Orb for background decoration
const GlassOrb = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { color?: 'purple' | 'blue' | 'pink' | 'green' }
>(({ className, color = 'purple', ...props }, ref) => {
    const colorClasses = {
        purple: 'bg-purple-500/30',
        blue: 'bg-blue-500/30',
        pink: 'bg-pink-500/30',
        green: 'bg-green-500/30',
    }

    return (
        <div
            ref={ref}
            className={cn(
                "absolute rounded-full blur-3xl pointer-events-none",
                colorClasses[color],
                className
            )}
            {...props}
        />
    )
})
GlassOrb.displayName = "GlassOrb"

export { GlassCard, GlassOrb, glassCardVariants }
