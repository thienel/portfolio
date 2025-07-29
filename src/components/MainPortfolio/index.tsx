import Header from './Header';
import styles from './MainPortfolio.module.scss';
import classNames from 'classnames/bind';
import NavBar from './NavBar';
import ParticleWaveBackground from '@components/ParticleWaveBackground';

const cx = classNames.bind(styles);

function MainPortfolio() {
    return (
    <div className={cx('wrapper')}>
        <Header/>
        <NavBar/>
              <ParticleWaveBackground />
        <div className={cx('description')}>
        <p>Hi, I'm Le Hung Thien – a junior IT student at FPT University and a back-end developer currently working with Go.</p>
        <p>I enjoy learning through books and hands-on research, and I'm actively looking for an internship to apply my skills and gain real-world experience.</p>
        <p>If you’re here, maybe by chance or interest, feel free to check out my resume and explore the projects I’ve built.  </p>
        </div>
    </div>
    );
}

export default MainPortfolio;
