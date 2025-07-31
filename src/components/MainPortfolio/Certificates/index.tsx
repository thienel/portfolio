import classNames from 'classnames/bind'
import styles from './Certificates.module.scss'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'

const cx = classNames.bind(styles)

function Certificates() {
  const { elementRef: headerRef } = useScrollAnimation({
    animationType: 'fadeUp',
    duration: 800,
    delay: 200,
  })

  const { elementRef: cert1Ref } = useScrollAnimation({
    animationType: 'slideLeft',
    duration: 800,
    delay: 300,
  })

  const { elementRef: cert2Ref } = useScrollAnimation({
    animationType: 'slideLeft',
    duration: 800,
    delay: 500,
  })

  const { elementRef: cert3Ref } = useScrollAnimation({
    animationType: 'slideLeft',
    duration: 800,
    delay: 700,
  })

  return (
    <div className={cx('wrapper')} id="certificates">
      <div className={cx('section-header', 'no-animation')} ref={headerRef}>
        <h1>Achievements & Certificates</h1>
      </div>

      <div className={cx('certificates-container')}>
        <div className={cx('certificate', 'no-animation')} ref={cert1Ref}>
          <div className={cx('certificate-header')}>
            <h3>CS50x: Introduction to Computer Science</h3>
            <p className={cx('issuer')}>Harvard University • 2025</p>
          </div>
          <p className={cx('description')}>
            Rigorous foundation in computer science covering algorithms, data structures, memory
            management, and software engineering principles. Implemented projects in C, Python, and
            web technologies.
          </p>
          <a
            href="/certificates/CS50x.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cx('certificate-link')}
          >
            View Certificate
          </a>
        </div>

        <div className={cx('certificate', 'no-animation')} ref={cert2Ref}>
          <div className={cx('certificate-header')}>
            <h3>FPTU-1000 Scholarship</h3>
            <p className={cx('issuer')}>FPT University • 2023–Present</p>
          </div>
          <p className={cx('description')}>
            A 50% tuition scholarship awarded for the complete duration of studies, conferred upon
            individuals for their superior accomplishments.
          </p>
          <a
            href="/certificates/chung_nhan_hoc_bong.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cx('certificate-link')}
          >
            View Certificate
          </a>
        </div>

        <div className={cx('certificate', 'no-animation')} ref={cert3Ref}>
          <div className={cx('certificate-header')}>
            <h3>Honorable Student Of Trimester</h3>
            <p className={cx('issuer')}>FPT University • Fall 2024</p>
          </div>
          <p className={cx('description')}>
            Semester honors for outstanding academic performance and active contribution to
            university community and technical initiatives.
          </p>
          <a
            href="/certificates/HSFall2024.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cx('certificate-link')}
          >
            View Certificate
          </a>
        </div>
      </div>
    </div>
  )
}

export default Certificates
