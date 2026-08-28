import React from 'react'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 220 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        role="img"
        aria-label="Forza Quotidiana"
      >
        <rect x="0" y="4" width="32" height="32" rx="8" fill="url(#fq-mark-bg)" />
        <path
          d="M8 26V14h2.4v3.6h7.2V14H20v12h-2.4v-3.6h-7.2V26H8z"
          fill="#f0c090"
        />
        <rect x="6" y="27.5" width="20" height="1.5" rx="0.75" fill="#c9783a" opacity="0.85" />
        <text
          x="42"
          y="26"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
          fontSize="15"
          fontWeight="700"
          letterSpacing="-0.02em"
        >
          Forza Quotidiana
        </text>
        <defs>
          <linearGradient id="fq-mark-bg" x1="0" y1="4" x2="32" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#211d19" />
            <stop offset="1" stopColor="#100f0e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
