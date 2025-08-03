import classNames from 'classnames/bind'
import styles from './NavBar.module.scss'

const cx = classNames.bind(styles)

function NavBar() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo')}>
        <a href="https://www.lethien.dev/portfolio">Le Thien</a>
      </div>
      <div className={cx('socials')}>
        <a href="https://github.com/thienel" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/lehungthien" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a
          href="resume/LeHungThien_GolangIntern_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </div>
      <div className={cx('email')}>
        <a href="mailto:lethien.dev@gmail.com">lethien.dev@gmail.com</a>
      </div>
    </div>
  )
}

export default NavBar
