import styles from './About.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

function About() {
  return (
    <div className={cx('wrapper')}>
      <p>
        Hi there! I'm Le Hung Thien (Le Thien), a junior backend developer at FPT University. I love
        all things clean, minimalist, yet powerful and efficient—that's definitely my style!
      </p>
      <p>
        That's why I'm focused on Golang development. So glad you're here! Feel free to check out my{' '}
        <a
          href={'/resume/LeHungThien-GolangDeveloper-Resume.pdf'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline' }}
        >
          Resume
        </a>{' '}
        and selected works below.
        <br /> Hope you have a great day!
      </p>
    </div>
  )
}

export default About
