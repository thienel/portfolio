import classNames from 'classnames/bind'
import styles from './Projects.module.scss'
import Project from './Project'

const cx = classNames.bind(styles)

const projectsData = [
  {
    title: 'Greenlight (REST API)',
    description:
      "This project was built while following Let's Go Further by Alex Edwards, which significantly deepened my understanding of Go backend development. It's a movie database management system featuring full CRUD operations, token-based authentication, and permission-based access control (PBAC). The project was developed entirely through the command-line interface, helping me grasp real-world workflows and production-ready patterns.",
    technologies: ['Golang', 'PostgreSQL'],
    githubUrl: 'https://github.com/thienel/greenlight',
  },
  {
    title: 'Snippetbox (Web Application)',
    description:
      "This was the first project where I used Golang, developed alongside the book Let's Go by Alex Edwards. It was through this project that I discovered how enjoyable Go can be. The application itself is a snippet management tool with expiration support and user login based on session authentication. The book covers nearly everything you need to learn and start using the language effectively. While the project doesn't dive into highly advanced techniques, it gave me a solid and practical foundation to build upon.",
    technologies: ['Golang', 'MySQL'],
    githubUrl: 'https://github.com/thienel/snippetbox',
  },
  {
    title: 'Tiktok Clone API',
    description:
      'This is a simulated backend API built to support my tiktok-clone-ui frontend project. The key takeaway from this project was learning how to structure code effectively using Clean Architecture principles. I also implemented all JWT-related features — a significant challenge for me at the time.',
    technologies: ['C#', 'SQL Server', 'JWT', 'Entity Framework', 'Identity'],
    githubUrl: 'https://github.com/thienel/tiktok-clone-api',
  },
  {
    title: 'Tiktok Clone UI',
    description:
      'This was the first project where I worked with ReactJS. The most challenging part was organizing components — I spent most of my time figuring out how to split and structure them in a clean and maintainable way. Integrating the frontend with the backend API also gave me a clearer understanding of how everything connects and works together. Working with plain JavaScript made refactoring quite difficult, which later motivated me to build my portfolio site using TypeScript instead.',
    technologies: ['ReactJS', 'SCSS', 'Axios'],
    githubUrl: 'https://github.com/thienel/tiktok-clone-ui',
  },
  {
    title: 'Portfolio (this website)',
    description:
      'This self-initiated project was built to recreate UI effects that I found compelling. The computer simulation (lethien.dev) was inspired by Edward Hinrichsen and the background behind this was inspired from Keita Yamada. It also marked my first experience working with WebGL, TypeScript, and GSAP — technologies that initially made the development process quite challenging. Overcoming these hurdles significantly deepened my understanding of browser-based graphics and animation.',
    technologies: ['React', 'TypeScript', 'Vite', 'GSAP', 'WebGL'],
    // githubUrl: 'https://github.com/thienel/portfolio',
  },
]

function Projects() {
  return (
    <div className={cx('wrapper')} id="projects">
      <h2 className={cx('section-title')}>Projects</h2>
      <div className={cx('projects-grid')}>
        {projectsData.map((project, index) => (
          <Project
            key={index}
            title={project.title}
            description={project.description}
            technologies={project.technologies}
            githubUrl={project.githubUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
