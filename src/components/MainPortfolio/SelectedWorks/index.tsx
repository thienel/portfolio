import classNames from 'classnames/bind'
import styles from './SelectedWorks.module.scss'
import TechStacks from './TechStacks'
import Project from './Project'
import { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'

const cx = classNames.bind(styles)

const projectsData = [
  {
    title: 'Greenlight',
    type: 'REST API',
    description:
      "This project provides RESTful API access for movie database management. Authentication is token-based, secured with bcrypt at a cost of 12, and authorization employs a permission-based access control scheme. The project's architecture and implementation largely follow Alex Edwards' \"Let's Go Further,\" incorporating key best practices such as data filtering and pagination, structured JSON logging, API rate limiting, and graceful application shutdown.",
    technologies: ['Golang', 'PostgreSQL'],
    githubUrl: 'https://github.com/thienel/greenlight',
    year: 2025,
    techs: ['Go', 'PostgreSQL', 'smtp'],
  },
  {
    title: 'Snippetbox',
    type: 'Web Application',
    description:
      'This project implements time-limited snippet storage, with user authentication managed via database-persisted sessions. The system incorporates both unit tests and integration tests to ensure its reliability.',
    technologies: ['Golang', 'MySQL'],
    githubUrl: 'https://github.com/thienel/snippetbox',
    year: 2025,
    imageUrl: '/images/SnippetBox.png',
    techs: ['Go', 'MySQL'],
  },
  {
    title: 'Tiktok Clone Backend',
    type: 'Web API',
    description:
    "This project provides the API for the TikTokClone UI (mentioned below). It's built strictly adhering to Clean Architecture principles and uses JWT for user authentication. Additionally, it includes rate limiting and a global error handling middleware. \n"+
      "\n"+
      "The project is transitioning to a microservices architecture, with a video microservice built in Go using gRPC for internal communication. Future expansions will cover messaging and other functionalities as separate microservices.",
    technologies: ['C#', 'SQL Server', 'JWT', 'Entity Framework', 'Identity'],
    githubUrl: 'https://github.com/thienel/tiktok-clone/tree/main/backend',
    year: 2025,
    techs: ['Cs', 'SqlServer', 'entity', 'identity', 'jwt', 'cleanarchitecture', 'smtp', 'Go', 'PostgreSQL', 'gRPC'],
  },
  {
    title: 'Tiktok Clone Frontend',
    type: 'Web UI',
    description:
      'This project meticulously simulates the UI and details of TikTok. It incorporates features like theme switching, real-time form validation, and comprehensive authentication related functionalities.',
    technologies: ['ReactJS', 'SCSS', 'Axios'],
    githubUrl: 'https://github.com/thienel/tiktok-clone/tree/main/frontend',
    year: 2025,
    imageUrl: '/images/TiktokCloneUI.png',
    techs: ['React', 'jwt', 'Js', 'Scss'],
  },
  {
    title: 'Portfolio',
    type: 'Website',
    description:
      'The project is inspired by Edward Hinrichsen and Keita Yamada, and was completed with significant contributions from AI.',
    technologies: ['React', 'TypeScript', 'Vite', 'GSAP', 'WebGL'],
    year: 2025,
    imageUrl: '/images/Portfolio.png',
    techs: ['React', 'Scss', 'WebGL', 'Ts'],
    githubUrl: 'https://www.lethien.dev',
  },
]

function SelectedWorks() {
  const [currentTechs, setCurrentTechs] = useState<string[]>([])
  const [showTechStacks, setShowTechStacks] = useState<boolean>(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false)
  const projectRefs = useRef<(HTMLElement | null)[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { elementRef: headerRef } = useScrollAnimation({
    animationType: 'fadeUp',
    duration: 800,
    delay: 200,
  })

  const { elementRef: sectionRef } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -20% 0px',
    onEnter: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setIsAnimatingOut(false)
      setShowTechStacks(true)
    },
    onLeave: () => {
      setIsAnimatingOut(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setShowTechStacks(false)
        setIsAnimatingOut(false)
        timeoutRef.current = null
      }, 300)
    },
    onEnterBack: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setIsAnimatingOut(false)
      setShowTechStacks(true)
    },
    onLeaveBack: () => {
      setIsAnimatingOut(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setShowTechStacks(false)
        setIsAnimatingOut(false)
        timeoutRef.current = null
      }, 300)
    },
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = projectRefs.current.findIndex(ref => ref === entry.target)
            if (index !== -1) {
              setCurrentTechs(projectsData[index].techs)
            }
          }
        })
      },
      { threshold: 0.8 },
    )

    projectRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => {
      observer.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={cx('wrapper')} ref={sectionRef} id="selected-works">
      <div className={cx('section-header')} ref={headerRef}>
        <h1>Selected Works</h1>
      </div>

      <div className={cx('projects-container')}>
        {projectsData.map((project, index) => (
          <div
            key={project.title}
            ref={el => {
              projectRefs.current[index] = el
            }}
            className={cx('project')}
          >
            <Project
              title={project.title}
              type={project.type}
              description={project.description}
              year={project.year}
              githubUrl={project.githubUrl}
              imageUrl={project.imageUrl}
            />
          </div>
        ))}
      </div>

      {showTechStacks && <TechStacks techs={currentTechs} isAnimatingOut={isAnimatingOut} />}
    </div>
  )
}

export default SelectedWorks
