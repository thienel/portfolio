import styles from './Header.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

function Header() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>
        <h1>Le Hung Thien</h1>
        <p>
          Backend Developer & Problem Solver
          <br />
          Welcome to my digital space.
        </p>
      </div>
      <div className={cx('logo')}>
        <img src="/images/avatar.png" alt="Le Hung Thien" />
      </div>
    </div>
  )
}

export default Header
