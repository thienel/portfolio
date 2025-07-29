import classNames from 'classnames/bind'
import styles from './NavBar.module.scss'

const cx = classNames.bind(styles)

function NavBar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    const scrollContainer = document.getElementById('main-portfolio')

    if (element && scrollContainer) {
      const offset = 100
      const y = element.offsetTop - offset
      scrollContainer.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    const scrollContainer = document.getElementById('main-portfolio')
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openGithub = () => {
    window.open('https://github.com/thienel', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('nav-item')} onClick={scrollToTop}>
        Home
      </div>
      <div className={cx('nav-item')} onClick={() => scrollToSection('projects')}>
        Projects
      </div>
      <div className={cx('nav-item')} onClick={() => scrollToSection('certificates')}>
        Certificates
      </div>
      <div className={cx('nav-item')} onClick={() => scrollToSection('contact')}>
        Contact
      </div>
      <div className={cx('nav-item')} onClick={openGithub}>
        Github
      </div>
    </div>
  )
}

export default NavBar
