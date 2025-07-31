import { useEffect, useState } from 'react'
import styles from './Preloader.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface PreloaderProps {
  isLoading: boolean
  onComplete: () => void
}

function Preloader({ isLoading, onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isLoading) return

    // Wait a bit for components to render
    const checkImages = () => {
      const images = Array.from(document.querySelectorAll('img'))
      const totalImages = images.length
      let loadedImages = 0

      console.log(`Found ${totalImages} images to load`)

      if (totalImages === 0) {
        // If no images, wait a bit longer and check again
        setTimeout(() => {
          const newImages = Array.from(document.querySelectorAll('img'))
          if (newImages.length === 0) {
            setProgress(100)
            // Start animations immediately when progress reaches 100%
            setIsVisible(false)
            setTimeout(onComplete, 300) // Just fade out time
          } else {
            checkImages() // Recursive check
          }
        }, 500)
        return
      }

      const updateProgress = () => {
        const currentProgress = (loadedImages / totalImages) * 100
        setProgress(currentProgress)
        console.log(`Progress: ${Math.round(currentProgress)}% (${loadedImages}/${totalImages})`)

        if (loadedImages === totalImages) {
          // Start animations immediately when progress reaches 100%
          setIsVisible(false)
          setTimeout(onComplete, 300) // Just fade out time
        }
      }

      const handleImageLoad = () => {
        loadedImages++
        updateProgress()
      }

      const handleImageError = () => {
        loadedImages++
        updateProgress()
      }

      // Check if images are already loaded or add listeners
      images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
          loadedImages++
        } else {
          img.addEventListener('load', handleImageLoad, { once: true })
          img.addEventListener('error', handleImageError, { once: true })
        }
      })

      // Initial progress update
      updateProgress()
    }

    // Wait for components to mount and render
    setTimeout(checkImages, 300)
  }, [isLoading, onComplete])

  if (!isVisible) return null

  return (
    <div className={cx('preloader', { 'fade-out': !isLoading && progress >= 100 })}>
      <div className={cx('content')}>
        <div className={cx('progress-container')}>
          <div className={cx('progress-bar')}>
            <div className={cx('progress-fill')} style={{ width: `${progress}%` }} />
          </div>
          <span className={cx('progress-text')}>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}

export default Preloader
