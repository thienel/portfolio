import Header from './Header'
import styles from './MainPortfolio.module.scss'
import classNames from 'classnames/bind'
import NavBar from './NavBar'
import ParticleWaveBackground from '@components/ParticleWaveBackground'
import Projects from './Projects'
import Certificates from './Certificates'
import Contact from './Contact'
import About from './About'

const cx = classNames.bind(styles)

function MainPortfolio() {
  return (
    <div className={cx('wrapper')} id="main-portfolio">
      <ParticleWaveBackground />
      <Header />
      <NavBar />
      <About />
      <Projects />
      <Certificates />
      <Contact />
    </div>
  )
}

export default MainPortfolio
