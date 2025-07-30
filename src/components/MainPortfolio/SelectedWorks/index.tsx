import classNames from 'classnames/bind'
import styles from './SelectedWorks.module.scss'
import TechStacks from './TechStacks'
import Project from './Project'
import { useEffect, useRef, useState } from 'react'
import { useScrollTrigger } from '~/hooks/useScrollTrigger'

const cx = classNames.bind(styles)

const projectsData = [
  {
    title: 'Greenlight',
    type: 'REST API',
    description:
      "This project was built while following Let's Go Further by Alex Edwards, which significantly deepened my understanding of Go backend development. It's a movie database management system featuring full CRUD operations, token-based authentication, and permission-based access control (PBAC). The project was developed entirely through the command-line interface, helping me grasp real-world workflows and production-ready patterns.",
    technologies: ['Golang', 'PostgreSQL'],
    githubUrl: 'https://github.com/thienel/greenlight',
    year: 2025,
    techs: ['Go', 'PostgreSQL', 'smtp'],
  },
  {
    title: 'Snippetbox',
    type: 'Web Application',
    description:
      "This was the first project where I used Golang, developed alongside the book Let's Go by Alex Edwards. It was through this project that I discovered how enjoyable Go can be. The application itself is a snippet management tool with expiration support and user login based on session authentication. The book covers nearly everything you need to learn and start using the language effectively. While the project doesn't dive into highly advanced techniques, it gave me a solid and practical foundation to build upon.",
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
      'This is a simulated backend API built to support my tiktok-clone-ui frontend project. The key takeaway from this project was learning how to structure code effectively using Clean Architecture principles. I also implemented all JWT-related features — a significant challenge for me at the time.',
    technologies: ['C#', 'SQL Server', 'JWT', 'Entity Framework', 'Identity'],
    githubUrl: 'https://github.com/thienel/tiktok-clone-api',
    year: 2025,
    techs: ['Cs', 'SqlServer', 'entity', 'identity', 'jwt', 'cleanarchitecture', 'smtp'],
  },
  {
    title: 'Tiktok Clone Frontend',
    type: 'Web UI',
    description:
      'This was the first project where I worked with ReactJS. The most challenging part was organizing components — I spent most of my time figuring out how to split and structure them in a clean and maintainable way. Integrating the frontend with the backend API also gave me a clearer understanding of how everything connects and works together. Working with plain JavaScript made refactoring quite difficult, which later motivated me to build my portfolio site using TypeScript instead.',
    technologies: ['ReactJS', 'SCSS', 'Axios'],
    githubUrl: 'https://github.com/thienel/tiktok-clone-ui',
    year: 2025,
    imageUrl: '/images/TiktokCloneUI.png',
    techs: ['React', 'jwt', 'Js'],
  },
  {
    title: 'Portfolio',
    type: 'Website',
    description:
      'This self-initiated project was built to recreate UI effects that I found compelling. The computer simulation (lethien.dev) was inspired by Edward Hinrichsen and the background behind this was inspired from Keita Yamada. It also marked my first experience working with WebGL, TypeScript, and GSAP — technologies that initially made the development process quite challenging. Overcoming these hurdles significantly deepened my understanding of browser-based graphics and animation.',
    technologies: ['React', 'TypeScript', 'Vite', 'GSAP', 'WebGL'],
    year: 2025,
    imageUrl: '/images/Portfolio.png',
    techs: ['React', 'gsap', 'WebGL', 'Ts'],
  },
]

function SelectedWorks() {
  const [currentTechs, setCurrentTechs] = useState<string[]>([])
  const [showTechStacks, setShowTechStacks] = useState<boolean>(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false)
  const projectRefs = useRef<(HTMLElement | null)[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const sectionRef = useScrollTrigger<HTMLDivElement>({
    start: 'top 80%',
    end: 'bottom 20%',
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
      { threshold: 0.5 },
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

      {showTechStacks && <TechStacks techs={currentTechs} isAnimatingOut={isAnimatingOut} />}
    </div>
  )
}

export default SelectedWorks
