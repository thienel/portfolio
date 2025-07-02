import classNames from "classnames/bind";
import styles from "./Welcome.module.scss"

const cx = classNames.bind(styles)

function Welcome() {
    return (
        <div className="wrapper">
            <span className={cx("character")}>L</span>
            <span className={cx("character")}>L</span>
            <span className={cx("character")}>E</span>
            <span className={cx("character")}>T</span>
            <span className={cx("character")}>H</span>
            <span className={cx("character")}>I</span>
            <span className={cx("character")}>E</span>
            <span className={cx("character")}>N</span>
        </div>
     );
}

export default Welcome;
