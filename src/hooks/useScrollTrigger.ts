import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface UseScrollTriggerOptions {
  start?: string
  end?: string
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
  markers?: boolean
  once?: boolean
}

export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollTriggerOptions = {},
) {
  const elementRef = useRef<T | null>(null)

  const {
    start = 'top 80%',
    end = 'bottom 20%',
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    markers = false,
    once = false,
  } = options

  useEffect(() => {
    if (!elementRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: elementRef.current,
      start,
      end,
      markers,
      once,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
    })

    return () => {
      trigger.kill()
    }
  }, [start, end, onEnter, onLeave, onEnterBack, onLeaveBack, markers, once])

  return elementRef
}

export function useSectionAnimation<T extends HTMLElement = HTMLDivElement>(
  animationType: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' = 'fadeUp',
) {
  const elementRef = useRef<T | null>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    let fromProps: gsap.TweenVars
    let toProps: gsap.TweenVars

    switch (animationType) {
      case 'fadeUp':
        fromProps = { autoAlpha: 0, y: 50 }
        toProps = { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        break
      case 'fadeIn':
        fromProps = { autoAlpha: 0 }
        toProps = { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }
        break
      case 'slideLeft':
        fromProps = { autoAlpha: 0, x: 100 }
        toProps = { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        break
      case 'slideRight':
        fromProps = { autoAlpha: 0, x: -100 }
        toProps = { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        break
    }

    gsap.set(element, fromProps)

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(element, toProps)
      },
    })

    return () => {
      trigger.kill()
    }
  }, [animationType])

  return elementRef
}
