'use client'

import dynamic from 'next/dynamic'
import type { CSSProperties } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type Props = {
  animationData: object
  loop?: boolean
  autoplay?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Wrapper de lottie-react con SSR off (Lottie usa window).
 * Lazy load: el chunk de lottie-react solo se descarga cuando se usa.
 */
export function LottiePlayer({
  animationData,
  loop = true,
  autoplay = true,
  className,
  style,
}: Props) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
    />
  )
}
