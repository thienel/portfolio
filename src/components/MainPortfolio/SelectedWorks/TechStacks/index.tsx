import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import styles from './TechStacks.module.scss'
import classNames from 'classnames/bind'
import logoList from '~/assets/logo-svg'

const cx = classNames.bind(styles)

const techList = [
  { id: 'smtp', title: 'SMTP', size: '20px' },
  { id: 'React', title: 'React', size: '16px' },
  { id: 'Go', title: 'Golang', size: '23px' },
  { id: 'entity', title: 'Entity Framework', size: '20px' },
  { id: 'SqlServer', title: 'SQL Server', size: '25px' },
  { id: 'WebGL', title: 'WebGL', size: '30px' },
  { id: 'cleanarchitecture', title: 'Clean Architecture', size: '20px' },
  { id: 'jwt', title: 'JWT', size: '20px' },
  { id: 'PostgreSQL', title: 'PostgreSQL', size: '18px' },
  { id: 'identity', title: 'Identity', size: '20px' },
  { id: 'Scss', title: 'SCSS', size: '20px' },
  { id: 'Cs', title: 'C#', size: '24px' },
  { id: 'MySQL', title: 'MySQL', size: '25px' },
  { id: 'Js', title: 'Javascript', size: '15px' },
  { id: 'Ts', title: 'TypeScript', size: '15px' },
] as const

function TechStacks({ techs, isAnimatingOut }: { techs: string[]; isAnimatingOut: boolean }) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Fade in animation when component mounts
  useEffect(() => {
    if (!containerRef.current) return

    // Set initial state and fade in
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' },
    )
  }, [])

  // Fade out animation when isAnimatingOut becomes true
  useEffect(() => {
    if (!isAnimatingOut || !containerRef.current) return

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    })
  }, [isAnimatingOut])

  // Handle tech selection changes
  useEffect(() => {
    const validItems = itemsRef.current.filter(item => item !== null)

    validItems.forEach(el => {
      const id = el.dataset.id
      const isSelected = techs.includes(id!)

      gsap.to(el, {
        opacity: isSelected ? 1 : 0.5,
        scale: isSelected ? 1 : 0.95,
        duration: 0.5,
        ease: 'sine.out',
      })
    })
  }, [techs])

  return (
    <div className={cx('wrapper')} ref={containerRef}>
      <h1>Tech Stacks</h1>
      {techList.map((tech, index) => {
        const Component = logoList[tech.id as keyof typeof logoList]
        const isSelected = techs.includes(tech.id)

        return (
          <div
            key={tech.id}
            data-id={tech.id}
            ref={el => {
              itemsRef.current[index] = el
            }}
            className={cx('item', { selected: isSelected })}
          >
            {Component && (
              <Component className={cx('icon')} color="currentcolor" width={tech.size} />
            )}
            <p className={cx('title')}>{tech.title}</p>
          </div>
        )
      })}
    </div>
  )
}

export default TechStacks
