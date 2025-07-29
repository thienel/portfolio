import classNames from 'classnames/bind'
import styles from './Contact.module.scss'

const cx = classNames.bind(styles)

function Contact() {
  return (
    <div className={cx('wrapper')} id="contact">
      <h2 className={cx('title')}>Contact Me</h2>
      <div className={cx('contact-content')}>
        <div className={cx('contact-info')}>
          <div className={cx('contact-item')}>
            <h3 className={cx('contact-label')}>Email</h3>
            <a href="mailto:lethien.dev@gmail.com" className={cx('contact-link')}>
              lethien.dev@gmail.com
            </a>
          </div>

          <div className={cx('contact-item')}>
            <h3 className={cx('contact-label')}>Phone</h3>
            <a href="tel:0397551218" className={cx('contact-link')}>
              +84 397 551 218
            </a>
          </div>

          <div className={cx('contact-item')}>
            <h3 className={cx('contact-label')}>LinkedIn</h3>
            <a
              href="https://www.linkedin.com/in/lehungthien"
              target="_blank"
              rel="noopener noreferrer"
              className={cx('contact-link')}
            >
              linkedin.com/in/lehungthien
            </a>
          </div>

          <div className={cx('contact-item')}>
            <h3 className={cx('contact-label')}>GitHub</h3>
            <a
              href="https://github.com/thienel"
              target="_blank"
              rel="noopener noreferrer"
              className={cx('contact-link')}
            >
              github.com/thienel
            </a>
          </div>
        </div>

        <div className={cx('contact-message')}>
          <p>
            I'm always open to discussing new opportunities, interesting projects, or just having a
            chat about technology and development.
          </p>
          <p>
            Feel free to reach out if you'd like to connect or have any questions about my work and
            experience.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact
