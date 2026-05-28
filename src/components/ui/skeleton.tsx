import { cn } from '@/lib/utils/cn'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** 'shimmer' (default) | 'pulse' */
  variant?: 'shimmer' | 'pulse'
}

export function Skeleton({ className, variant = 'shimmer', ...props }: Props) {
  return (
    <div
      className={cn(
        'rounded-md bg-bg-raised',
        variant === 'shimmer'
          ? 'relative overflow-hidden before:absolute before:inset-0 before:bg-shimmer-gradient before:bg-[length:200%_100%] before:animate-shimmer'
          : 'animate-pulse',
        className,
      )}
      {...props}
    />
  )
}
