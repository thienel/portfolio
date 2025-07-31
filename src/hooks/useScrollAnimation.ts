import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number | number[]
  rootMargin?: string
  animationType?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp'
  duration?: number
  delay?: number
  once?: boolean
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {},
) {
  const elementRef = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasTriggeredRef = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px', // Changed default to prevent immediate trigger
    animationType = 'fadeUp',
    duration = 800,
    delay = 0,
    once = true,
  } = options

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    // Set initial styles based on animation type
    const setInitialStyles = () => {
      element.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      element.style.transitionDelay = `${delay}ms`
      element.style.willChange = 'opacity, transform'

      switch (animationType) {
        case 'fadeUp':
          element.style.opacity = '0'
          element.style.transform = 'translateY(60px)'
          break
        case 'fadeIn':
          element.style.opacity = '0'
          element.style.transform = 'none'
          break
        case 'slideLeft':
          element.style.opacity = '0'
          element.style.transform = 'translateX(80px)'
          break
        case 'slideRight':
          element.style.opacity = '0'
          element.style.transform = 'translateX(-80px)'
          break
        case 'scaleUp':
          element.style.opacity = '0'
          element.style.transform = 'scale(0.8) translateY(20px)'
          break
      }
    }

    // Set final styles for animation
    const setFinalStyles = () => {
      element.style.opacity = '1'
      element.style.transform = 'translateY(0) translateX(0) scale(1)'
      // Remove will-change after animation completes
      setTimeout(() => {
        element.style.willChange = 'auto'
      }, duration + delay)
    }

    // Reset to initial styles
    const resetStyles = () => {
      switch (animationType) {
        case 'fadeUp':
          element.style.opacity = '0'
          element.style.transform = 'translateY(60px)'
          break
        case 'fadeIn':
          element.style.opacity = '0'
          element.style.transform = 'none'
          break
        case 'slideLeft':
          element.style.opacity = '0'
          element.style.transform = 'translateX(80px)'
          break
        case 'slideRight':
          element.style.opacity = '0'
          element.style.transform = 'translateX(-80px)'
          break
        case 'scaleUp':
          element.style.opacity = '0'
          element.style.transform = 'scale(0.8) translateY(20px)'
          break
      }
    }

    setInitialStyles()

    // Delay observer creation to prevent immediate animations
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isCurrentlyIntersecting = entry.isIntersecting

          if (isCurrentlyIntersecting && (!hasTriggeredRef.current || !once)) {
            setIsVisible(true)
            setFinalStyles()
            hasTriggeredRef.current = true
          } else if (!isCurrentlyIntersecting && !once) {
            setIsVisible(false)
            resetStyles()
          }
        },
        {
          threshold,
          rootMargin,
        },
      )

      observer.observe(element)
      observerRef.current = observer
    }, 100) // Small delay to prevent immediate triggering

    return () => {
      clearTimeout(timeoutId)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, animationType, duration, delay, once])

  return { elementRef, isVisible }
}
