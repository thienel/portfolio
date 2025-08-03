import styles from './About.module.scss'
import classNames from 'classnames/bind'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'

const cx = classNames.bind(styles)

function About() {
  const { elementRef: headerRef } = useScrollAnimation({
    animationType: 'fadeUp',
    duration: 800,
    delay: 200,
  })

  const { elementRef: introRef } = useScrollAnimation({
    animationType: 'slideRight',
    duration: 800,
    delay: 400,
  })

  const { elementRef: detailsRef } = useScrollAnimation({
    animationType: 'slideRight',
    duration: 800,
    delay: 600,
  })

  return (
    <div className={cx('wrapper')}>
      <div className={cx('section-header', 'no-animation')} ref={headerRef}>
        <h1>About me</h1>
      </div>
      <div className={cx('content', 'no-animation')}>
        <p className={cx('intro', 'no-animation')} ref={introRef}>
          I'm Le Hung Thien (Le Thien), a junior backend developer at FPT University passionate
          about clean, minimalist, yet powerful and efficient solutions—that's definitely my style!
        </p>
        <p className={cx('details', 'no-animation')} ref={detailsRef}>
          Currently focused on <span className={cx('highlight')}>Golang development</span>, building
          robust APIs and exploring system design. Thanks for stopping by! Feel free to explore my{' '}
          <a
            href={'/resume/LeHungThien_GolangIntern_Resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className={cx('resume-link')}
          >
            Resume
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
