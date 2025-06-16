import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            className="rc-h-6 rc-hidden lg:rc-block xl:rc-hidden"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background circle with gradient */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Main background circle */}
            <circle
                cx="32"
                cy="32"
                r="30"
                fill="url(#logoGradient)"
                filter="url(#glow)"
            />

            {/* Three white data visualization bars - perfectly centered */}
            <g transform="translate(32, 32)">
                {/* Bar 1 - shortest (left) */}
                <rect
                    x="-18"
                    y="0"
                    width="8"
                    height="12"
                    rx="4"
                    fill="white"
                />

                {/* Bar 2 - medium (center) */}
                <rect
                    x="-4"
                    y="-6"
                    width="8"
                    height="18"
                    rx="4"
                    fill="white"
                />

                {/* Bar 3 - tallest (right) */}
                <rect
                    x="10"
                    y="-12"
                    width="8"
                    height="24"
                    rx="4"
                    fill="white"
                />
            </g>
        </svg>
    );
}
