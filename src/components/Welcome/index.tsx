import classNames from "classnames/bind";
import styles from "./Welcome.module.scss";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const cx = classNames.bind(styles);

const WELCOME_TEXT = "LETHIEN"

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
            duration: 2,
            stagger: 0.15,
            onUpdate: () => {
                characters.forEach(character => {
                    const randomNumber = Math.floor(Math.random() * 5) + 1;
                    gsap.to(character, {
                        color: "var(--color-white)",
                        duration: 0.2,
                        delay: randomNumber * 0.15
                    });
                    gsap.to(character, {
                        color: "var(--color-black)",
                        duration: 0.2,
                        delay: randomNumber * 0.15 + 0.5
                    });
                });
                console.log("Running")
            },
            onComplete: () => {
                gsap.set(wrapperRef.current, {
                    delay: 1,
                    display: "none"
                })
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
            {
                WELCOME_TEXT.split('').map((char, i) => (
                    <span key={i} className={cx("character")} data-character>{char}</span>
                 ))
            }
        </div>
    );
}

export default Welcome;
