import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
) {
  const elementRef = useRef<T | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const wasIntersectingRef = useRef(false)
  const hasEnteredOnceRef = useRef(false)

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -20% 0px',
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting
        const wasIntersecting = wasIntersectingRef.current
        const hasEnteredOnce = hasEnteredOnceRef.current

        setIsIntersecting(isCurrentlyIntersecting)

        if (isCurrentlyIntersecting && !wasIntersecting) {
          // Entering the viewport
          if (!hasEnteredOnce) {
            // First time entering
            onEnter?.()
            hasEnteredOnceRef.current = true
          } else {
            // Entering back from below
            onEnterBack?.()
          }
        } else if (!isCurrentlyIntersecting && wasIntersecting) {
          // Leaving the viewport
          if (hasEnteredOnce) {
            // Determine if leaving from top or bottom based on scroll direction
            const rect = entry.boundingClientRect
            const isLeavingFromTop = rect.bottom < 0

            if (isLeavingFromTop) {
              onLeaveBack?.()
            } else {
              onLeave?.()
            }
          }
        }

        wasIntersectingRef.current = isCurrentlyIntersecting
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, onEnter, onLeave, onEnterBack, onLeaveBack])

  return { elementRef, isIntersecting }
}
