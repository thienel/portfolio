import styles from './Header.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Header() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h1>Le Hung Thien</h1>
                <p>Welcome to my portfolio.<br />Hope you will find it interesting!</p>
            </div>
            <div className={cx('logo')}>
                <img src="/images/avatar.png" alt="Avatar" />
            </div>
        </div>
     );
}

export default Header;
