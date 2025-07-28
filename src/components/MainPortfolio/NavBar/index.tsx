import classNames from 'classnames/bind';
import styles from './NavBar.module.scss';

const cx = classNames.bind(styles);

function NavBar() {
    return (
        <div className={cx('wrapper')}>

                <div>Home</div>
                <div>Github</div>
                <div>Contact</div>
            </div>
    );
}

export default NavBar;
