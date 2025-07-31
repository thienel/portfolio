import Header from './Header'
import styles from './MainPortfolio.module.scss'
import classNames from 'classnames/bind'
import NavBar from './NavBar'
import ParticleWaveBackground from '@components/ParticleWaveBackground'
import Certificates from './Certificates'
import About from './About'
import SelectedWorks from './SelectedWorks'
import Footer from './Footer'
import Preloader from '@components/Preloader'
import { useState, useEffect } from 'react'

const cx = classNames.bind(styles)

function MainPortfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Wait for component to mount and then start checking for image loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Short delay to ensure component is mounted

    return () => clearTimeout(timer)
  }, [])

  const handlePreloadComplete = () => {
    setShowContent(true)
  }

  return (
    <>
      <Preloader isLoading={isLoading} onComplete={handlePreloadComplete} />

      <div className={cx('wrapper', { 'content-visible': showContent })} id="main-portfolio">
        <ParticleWaveBackground />
        <Header />
        <NavBar />
        <About />
        <SelectedWorks />
        <Certificates />
        <Footer />
      </div>
    </>
  )
}

export default MainPortfolio
