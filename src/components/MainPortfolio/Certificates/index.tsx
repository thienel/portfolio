import classNames from 'classnames/bind'
import styles from './Certificates.module.scss'

const cx = classNames.bind(styles)

// Sample certificate data - you can replace this with real data
const certificates = [
  {
    id: 1,
    title: '50% Scholarship Covering Full Program Tuition',
    issuer: 'FPT University',
    date: '2023',
    description:
      'This scholarship covers 50% of the tuition fees for the entire duration of the program at the university.',
    link: 'certificates/chung_nhan_hoc_bong.pdf',
  },
  {
    id: 2,
    title: 'Honorable student of trimester',
    issuer: 'FPT University',
    date: '2024',
    description: 'Honoring students with outstanding academic performance during the semester.',
    link: 'certificates/HSFall2024.pdf',
  },
  {
    id: 3,
    title: 'CS50x - Introduction to Computer Science',
    issuer: 'Harvard University',
    date: '2025',
    description:
      'Covered foundational topics in computer science, including algorithms, data structures, and programming in C.',
    link: 'certificates/CS50x.pdf',
  },
]

function Certificates() {
  return (
    <div className={cx('wrapper')} id="certificates">
      <h2 className={cx('title')}>Certificates</h2>
      <div className={cx('certificates-grid')}>
        {certificates.map(cert => (
          <div key={cert.id} className={cx('certificate-card')}>
            <h3 className={cx('certificate-title')}>{cert.title}</h3>
            <p className={cx('issuer')}>{cert.issuer}</p>
            <p className={cx('date')}>{cert.date}</p>
            <p className={cx('description')}>{cert.description}</p>
            {cert.link !== '#' && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cx('certificate-link')}
              >
                View Certificate
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Certificates
