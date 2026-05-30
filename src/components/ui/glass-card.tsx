import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const glassCardVariants = cva(
  'relative rounded-xl transition-all duration-normal ease-out-expo',
  {
    variants: {
      variant: {
        flat:        'glass',
        elevated:    'glass-strong',
        interactive: 'glass hover:bg-[hsl(var(--glass-bg)/0.8)] hover:border-[hsl(var(--brand-400)/0.5)] hover:shadow-glow-brand hover:-translate-y-0.5 cursor-pointer',
      },
      padding: {
        none: 'p-0',
        sm:   'p-2 md:p-3',
        md:   'p-3 md:p-5',
        lg:   'p-4 md:p-7',
        xl:   'p-5 md:p-9',
      },
    },
    defaultVariants: { variant: 'flat', padding: 'md' },
  },
)

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, padding, children, ...props }, ref) => (
    <div ref={ref} className={cn(glassCardVariants({ variant, padding }), className)} {...props}>
      {children}
    </div>
  ),
)
GlassCard.displayName = 'GlassCard'
