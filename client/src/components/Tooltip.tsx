import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = 'top',
    delay = 100
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                x: rect.left + rect.width / 2,
                y: position === 'top' ? rect.top : rect.bottom
            });
        }
    }, [isVisible, position]);

    const getPositionStyles = (): React.CSSProperties => {
        const gap = 8;
        switch (position) {
            case 'top':
                return {
                    left: coords.x,
                    top: coords.y - gap,
                    transform: 'translateX(-50%) translateY(-100%)'
                };
            case 'bottom':
                return {
                    left: coords.x,
                    top: coords.y + gap,
                    transform: 'translateX(-50%)'
                };
            case 'left':
                return {
                    left: coords.x - gap,
                    top: coords.y,
                    transform: 'translateX(-100%) translateY(-50%)'
                };
            case 'right':
                return {
                    left: coords.x + gap,
                    top: coords.y,
                    transform: 'translateY(-50%)'
                };
            default:
                return {};
        }
    };

    if (!content) return <>{children}</>;

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
                className="inline-flex cursor-pointer"
            >
                {children}
            </span>
            {isVisible && (
                <div
                    role="tooltip"
                    style={{
                        position: 'fixed',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        ...getPositionStyles()
                    }}
                    className="animate-in fade-in zoom-in-95 duration-150"
                >
                    <div
                        className="px-3 py-2 text-sm font-medium rounded-lg shadow-lg max-w-xs border"
                        style={{
                            background: 'white',
                            color: '#541388',
                            borderColor: 'rgba(84, 19, 136, 0.2)',
                            boxShadow: '0 4px 12px rgba(84, 19, 136, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)'
                        }}
                    >
                        {content}
                        {/* Arrow */}
                        <div
                            className="absolute w-2 h-2"
                            style={{
                                background: 'white',
                                border: '1px solid rgba(84, 19, 136, 0.2)',
                                borderTop: 'none',
                                borderLeft: 'none',
                                ...(position === 'top' && {
                                    bottom: '-4px',
                                    left: '50%',
                                    transform: 'translateX(-50%) rotate(45deg)'
                                }),
                                ...(position === 'bottom' && {
                                    top: '-4px',
                                    left: '50%',
                                    transform: 'translateX(-50%) rotate(45deg)'
                                }),
                                ...(position === 'left' && {
                                    right: '-4px',
                                    top: '50%',
                                    transform: 'translateY(-50%) rotate(45deg)'
                                }),
                                ...(position === 'right' && {
                                    left: '-4px',
                                    top: '50%',
                                    transform: 'translateY(-50%) rotate(45deg)'
                                })
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
