'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils/cn'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'glass z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs text-foreground shadow-elev-3',
        'data-[state=delayed-open]:data-[side=bottom]:slide-in-from-top-1',
        'data-[state=delayed-open]:data-[side=left]:slide-in-from-right-1',
        'data-[state=delayed-open]:data-[side=right]:slide-in-from-left-1',
        'data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-1',
        'animate-in fade-in-0 zoom-in-95',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
