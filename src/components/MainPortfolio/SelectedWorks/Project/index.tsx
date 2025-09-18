import styles from './Project.module.scss'
import classNames from 'classnames/bind'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'

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
  const { elementRef: titleRef } = useScrollAnimation({
    animationType: 'fadeUp',
    duration: 800,
    delay: 200,
  })

  const { elementRef: bodyRef } = useScrollAnimation({
    animationType: 'fadeUp',
    duration: 800,
    delay: 400,
  })

  return (
    <div className={cx('wrapper')}>
      <div className={cx('title-wrapper')} ref={titleRef}>
        <h1>{title}</h1>
        <h2>{type}</h2>
      </div>

      <div className={cx('body')} ref={bodyRef}>
        {imageUrl && <img src={imageUrl} alt={`${title} preview`} className={cx('image')} />}
        <div className={cx('body-item', 'event')}>
          <h2>Type</h2>
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
            View Project
          </a>
        </div>
      </div>
    </div>
  )
}

export default Project
