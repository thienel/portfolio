import styles from './About.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

function About() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('content')}>
        <p className={cx('intro')}>
          Hi there! I'm Le Hung Thien (Le Thien), a junior backend developer at FPT University
          passionate about clean, minimalist, yet powerful and efficient solutions—that's definitely
          my style!
        </p>
        <p className={cx('details')}>
          Currently focused on <span className={cx('highlight')}>Golang development</span>, building
          robust APIs and exploring system design. Thanks for stopping by! Feel free to explore my{' '}
          <a
            href={'/resume/LeHungThien-GolangDeveloper-Resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className={cx('resume-link')}
          >
            Resume →
          </a>{' '}
          and selected works below.
          <br />
          <span className={cx('closing')}>Hope you have a great day!</span>
        </p>
      </div>
    </div>
  )
}

export default About
