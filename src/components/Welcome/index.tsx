import classNames from 'classnames/bind'
import styles from './Welcome.module.scss'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

const cx = classNames.bind(styles)

const WELCOME_TEXT = 'LETHIEN'

function Welcome({ onComplete }: { onComplete?: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    const characters = wrapperRef.current.querySelectorAll('[data-character]')

    if (characters.length === 0) return

    gsap.set(characters, { opacity: 0 })
    gsap.set(wrapperRef.current, { opacity: 1 })

    gsap.to(characters, {
      opacity: 1,
      duration: 2,
      stagger: 0.15,
      onUpdate: () => {
        characters.forEach(character => {
          const randomNumber = Math.floor(Math.random() * 5) + 1
          gsap.to(character, {
            opacity: 1,
            duration: 0.2,
            delay: randomNumber * 0.15,
          })
          gsap.to(character, {
            opacity: 0,
            duration: 0.2,
            delay: randomNumber * 0.15 + 0.5,
          })
        })
        console.log('Running')
      },
      onComplete: () => {
        gsap.to(wrapperRef.current, {
          opacity: 0,
          duration: 1,
          delay: 0.5,
          onComplete: () => {
            gsap.set(wrapperRef.current, {
              display: 'none',
              onComplete: () => {
                if (onComplete) onComplete()
              },
            })
          },
        })
      },
    })

    return () => {
      gsap.killTweensOf(characters)
      if (wrapperRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        gsap.killTweensOf(wrapperRef.current)
      }
    }
  }, [onComplete])

  return (
    <div ref={wrapperRef} className={cx('wrapper')}>
      {WELCOME_TEXT.split('').map((char, i) => (
        <span key={i} className={cx('character')} data-character>
          {char}
        </span>
      ))}
    </div>
  )
}

export default Welcome
