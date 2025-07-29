import classNames from 'classnames/bind'
import styles from './Project.module.scss'

const cx = classNames.bind(styles)

interface ProjectProps {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
}

function Project({ title, description, technologies, githubUrl, liveUrl, imageUrl }: ProjectProps) {
  return (
    <div className={cx('wrapper')}>
      {imageUrl && (
        <div className={cx('image-container')}>
          <img src={imageUrl} alt={title} className={cx('project-image')} />
        </div>
      )}

      <div className={cx('content')}>
        <h3 className={cx('title')}>{title}</h3>

        <div className={cx('technologies')}>
          {technologies.map((tech, index) => (
            <span key={index} className={cx('tech-tag')}>
              {tech}
            </span>
          ))}
        </div>

        <p className={cx('description')}>{description}</p>

        <div className={cx('links')}>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cx('link', 'github-link')}
            >
              View Code
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cx('link', 'live-link')}
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Project
