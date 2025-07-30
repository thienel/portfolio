import classNames from 'classnames/bind'
import styles from './Footer.module.scss'

const cx = classNames.bind(styles)

function Footer() {
  return (
    <footer className={cx('wrapper')} id="footer">
      <div className={cx('content')}>
        <div className={cx('main-section')}>
          <div className={cx('brand')}>
            <h3>Le Hung Thien</h3>
            <p>Backend Developer & Problem Solver</p>
          </div>

          <div className={cx('links-section')}>
            <div className={cx('links-group')}>
              <h4>Connect</h4>
              <ul>
                <li>
                  <a
                    href="https://github.com/thienel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('footer-link')}
                  >
                    GitHub →
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/lehungthien"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('footer-link')}
                  >
                    LinkedIn →
                  </a>
                </li>
                <li>
                  <a href="mailto:lethien.dev@gmail.com" className={cx('footer-link')}>
                    Email →
                  </a>
                </li>
              </ul>
            </div>

            <div className={cx('links-group')}>
              <h4>Resources</h4>
              <ul>
                <li>
                  <a
                    href="/resume/LeHungThien-GolangDeveloper-Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('footer-link')}
                  >
                    Resume →
                  </a>
                </li>
                <li>
                  <a href="#selected-works" className={cx('footer-link')}>
                    Projects →
                  </a>
                </li>
                <li>
                  <a href="#certificates" className={cx('footer-link')}>
                    Certificates →
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={cx('divider')}></div>

        <div className={cx('bottom-section')}>
          <div className={cx('copyright')}>
            <p>© 2025 Le Hung Thien. Crafted with care and attention to detail.</p>
          </div>
          <div className={cx('tech-stack')}>
            <p>Built with React, TypeScript, SCSS & WebGL</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
