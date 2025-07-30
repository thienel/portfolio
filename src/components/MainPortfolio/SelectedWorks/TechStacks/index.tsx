import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import styles from './TechStacks.module.scss'
import classNames from 'classnames/bind'
import logoList from '~/assets/logo-svg'

const cx = classNames.bind(styles)

const techList = [
  { id: 'smtp', title: 'SMTP', size: '20px' },
  { id: 'React', title: 'React', size: '16px' },
  { id: 'entity', title: 'Entity Framework', size: '20px' },
  { id: 'SqlServer', title: 'SQL Server', size: '25px' },
  { id: 'Go', title: 'Golang', size: '23px' },
  { id: 'WebGL', title: 'WebGL', size: '30px' },
  { id: 'cleanarchitecture', title: 'Clean Architecture', size: '20px' },
  { id: 'jwt', title: 'JWT', size: '20px' },
  { id: 'PostgreSQL', title: 'PostgreSQL', size: '18px' },
  { id: 'identity', title: 'Identity', size: '20px' },
  { id: 'MySQL', title: 'MySQL', size: '25px' },
  { id: 'gsap', title: 'GSAP', size: '20px' },
  { id: 'Js', title: 'Javascript', size: '15px' },
  { id: 'Ts', title: 'TypeScript', size: '15px' },
  { id: 'Cs', title: 'C#', size: '24px' },
] as const

function TechStacks({ techs }: { techs: string[] }) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    gsap.fromTo(
      wrapperRef.current,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      },
    )

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      gsap.to(wrapperRef.current, {
        autoAlpha: 0,
        y: 30,
        duration: 0.3,
        ease: 'power3.in',
      })
    }
  }, [])

  useEffect(() => {
    itemsRef.current.forEach(el => {
      if (!el) return
      const id = el.dataset.id
      const isSelected = techs.includes(id!)

      gsap.to(el, {
        autoAlpha: isSelected ? 1 : 0.5,
        scale: isSelected ? 1 : 0.95,
        duration: 0.25,
        ease: 'sine.in',
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
