import classNames from "classnames/bind";
import styles from "./Welcome.module.scss";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const cx = classNames.bind(styles);

function Welcome() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        const characters = wrapperRef.current.querySelectorAll('[data-character]');

        if (characters.length === 0) return;

        gsap.set(characters, { opacity: 0 });
        gsap.set(wrapperRef.current, { opacity: 1});

        gsap.to(characters, {
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            onUpdate: () => {
                characters.forEach((character, i) => {
                    gsap.to(character, {
                        color: "var(--color-white)",
                        duration: 0.2,
                        delay: i * 0.15
                    });
                    gsap.to(character, {
                        color: "var(--color-black)",
                        duration: 0.2,
                        delay: i * 0.15 + 0.4
                    });
                });
            },
            onComplete: () => {
                gsap.to(wrapperRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.3,
                    onComplete: () => {
                        if (wrapperRef.current) {
                            gsap.set(wrapperRef.current, { display: "none" });
                        }
                    }
                });
            }
        });

        return () => {
            gsap.killTweensOf(characters);
            if (wrapperRef.current) {
                gsap.killTweensOf(wrapperRef.current);
            }
        };
    }, []);

    return (
        <div ref={wrapperRef} className={cx("wrapper")}>
            <span className={cx("character")} data-character>L</span>
            <span className={cx("character")} data-character>E</span>
            <span className={cx("character")} data-character>T</span>
            <span className={cx("character")} data-character>H</span>
            <span className={cx("character")} data-character>I</span>
            <span className={cx("character")} data-character>E</span>
            <span className={cx("character")} data-character>N</span>
        </div>
    );
}

export default Welcome;
