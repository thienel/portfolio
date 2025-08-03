import classNames from 'classnames/bind'
import styles from './Footer.module.scss'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'

const cx = classNames.bind(styles)

function Footer() {
  const { elementRef: wrapperRef } = useScrollAnimation({
    animationType: 'fadeUp',
    duration: 800,
    delay: 200,
  })

  const { elementRef: mainSectionRef } = useScrollAnimation({
    animationType: 'slideLeft',
    duration: 800,
    delay: 400,
  })

  const { elementRef: bottomSectionRef } = useScrollAnimation({
    animationType: 'fadeIn',
    duration: 600,
    delay: 600,
  })

  return (
    <footer className={cx('wrapper', 'no-animation')} id="footer" ref={wrapperRef}>
      <div className={cx('content')}>
        <div className={cx('main-section', 'no-animation')} ref={mainSectionRef}>
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
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/lehungthien"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('footer-link')}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="mailto:lethien.dev@gmail.com" className={cx('footer-link')}>
                    Email
                  </a>
                </li>
              </ul>
            </div>

            <div className={cx('links-group')}>
              <h4>Resources</h4>
              <ul>
                <li>
                  <a
                    href="/resume/LeHungThien_GolangIntern_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('footer-link')}
                  >
                    Resume
                  </a>
                </li>
                <li>
                  <a href="#selected-works" className={cx('footer-link')}>
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#certificates" className={cx('footer-link')}>
                    Certificates
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={cx('divider')}></div>

        <div className={cx('bottom-section')} ref={bottomSectionRef}>
          <div className={cx('copyright')}>
            <p>&copy; 2025 Le Hung Thien</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
