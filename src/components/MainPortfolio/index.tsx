import Header from './Header'
import styles from './MainPortfolio.module.scss'
import classNames from 'classnames/bind'
import NavBar from './NavBar'
import ParticleWaveBackground from '@components/ParticleWaveBackground'
import Certificates from './Certificates'
import About from './About'
import SelectedWorks from './SelectedWorks'
import Footer from './Footer'

const cx = classNames.bind(styles)

function MainPortfolio() {
  return (
    <div className={cx('wrapper')} id="main-portfolio">
      <ParticleWaveBackground />
      <Header />
      <NavBar />
      <About />
      <SelectedWorks />
      <Certificates />
      <Footer />
    </div>
  )
}

export default MainPortfolio
