'use client'

import React, { ReactNode, useState, useEffect, useCallback, useMemo, useRef, CSSProperties, useLayoutEffect } from "react";


type MarqueeProps = {
    items: ReactNode[],
    gap: number,
    duration: number,
    itemClassName?: string,
    axis?: "x" | "y",
    className?: string,
    direction: "pos" | "neg",
    pauseOnHover?: boolean,
    delay?: number
};

function Marquee({
    items,
    duration,
    gap,
    itemClassName = "",
    axis = "x",
    className = "",
    direction,
    pauseOnHover = false,
    delay = 0
}: MarqueeProps) {

    const [isPause, setIsPause] = useState<boolean>(false);
    const [containersLength, setContainersLength] = useState<number>(0);
    const { current: cssVars } = useRef<CSSProperties>({
        '--gap': `${gap}em`,
        '--animation-duration': `${duration}s`,
        '--start': direction === "pos" ? "-100%" : "0",
        '--end': direction === "pos" ? "0" : "-100%",
        '---play-state': pauseOnHover ? (isPause ? "paused" : "running") : "running"
    } as CSSProperties)

    useLayoutEffect(() => {
        const length = axis === "y"
            ? Math.ceil(window.innerHeight / (items.length * 50)) + 2
            : Math.ceil(window.innerWidth / (items.length * 100)) + 2;
        setContainersLength(length);
    }, [axis, items.length]);

    const handleMouseEnter = useCallback(() => pauseOnHover && setIsPause(true),[pauseOnHover]);
    const handleMouseLeave = useCallback(() => pauseOnHover && setIsPause(false),[pauseOnHover]);

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={cssVars}
            className={`${axis === "y" ? "marquee_y" : "marquee_x"} ${className}`}
        >
            {
                items.length ? (Array(containersLength).fill("").map((_, index) => (
                    <ul key={index} className="marquee_content">
                        {
                            items.map((txt, idx) => (
                                <li
                                    className={`${itemClassName} min-w-[100px] min-h-full flex justify-center items-center`}
                                    key={idx}
                                >
                                    {txt}
                                </li>
                            ))
                        }
                    </ul>
                ))) : <>not items in the marquee</>
            }
        </div>
    );
}

export default Marquee;
