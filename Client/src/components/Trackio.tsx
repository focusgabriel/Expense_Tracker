/**
 * TrackKioLogo Component
 * Designed to fit cleanly inside small cards, boxes, or sidebars (< 300px width).
 */
export default function TrackKioLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex flex-col items-start justify-start select-none ${className}`}>

      {/* Logo Text & Vector Wrapper — larger default size */}
      <div className="flex items-center justify-start font-bold text-[clamp(1.5rem,7vw,2.75rem)] leading-none">

        {/* "Track" Text */}
        <span className="text-[#050B17] text-3xl tracking-tight font-sans">
          Trac
        </span>

        {/* "kio" Container — seamlessly attached with no gap */}
        <span className="flex items-center">
          {/* Stylized "k" Logo Mark */}
          <span className="relative inline-block w-[0.72em] h-[0.85em] self-center text-3xl">
            <svg
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              <path
                d="M 12 110 L 12 25 C 12 10, 28 5, 45 5 L 45 22 C 30 22, 28 28, 28 38 L 28 110 Z"
                fill="url(#blueGradBox)"
              />
              <path
                d="M 28 68 L 78 110 L 52 110 L 12 76 Z"
                fill="url(#blueGradBox)"
              />
              <path
                d="M 16 52 C 10 40, 25 22, 50 18 L 75 18 C 60 32, 40 45, 28 65 Z"
                fill="url(#foldGradBox)"
              />
            </svg>
          </span><span className="inline-flex items-baseline text-2xl">
            <span className="text-transparent bg-clip-text bg-linear-to-b from-[#00C6FF] via-[#0072FF] to-[#003BFF] ">
              i
            <span className="text-transparent bg-clip-text bg-linear-to-tr from-[#003BFF] via-[#0072FF] to-[#00E5FF] ">
              u
            </span>
            </span>
          </span>
        </span>

      </div>

    </div>
  );
}