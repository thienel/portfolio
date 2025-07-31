import styles from './Project.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface ProjectProps {
  title: string
  type: string
  description: string
  year: number
  githubUrl?: string
  imageUrl?: string
}

function Project({ title, type, description, year, githubUrl, imageUrl }: ProjectProps) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('title-wrapper')}>
        <h1>{title}</h1>
        <h2>{type}</h2>
      </div>

      <div className={cx('body')}>
        {imageUrl && <img src={imageUrl} alt={`${title} preview`} className={cx('image')} />}
        <div className={cx('body-item', 'event')}>
          <h2>Event</h2>
          <p>Personal Project</p>
        </div>
        <div className={cx('body-item', 'year', { noimg: !imageUrl })}>
          <h2>Year</h2>
          <p>{year}</p>
        </div>
        <div className={cx('body-item', 'description', { noimg: !imageUrl })}>
          <h2>Description</h2>
          <p>{description}</p>
        </div>
        <div className={cx('github')}>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx('project-link')}
          >
            View Project →
          </a>
        </div>
      </div>
    </div>
  )
}

export default Project
