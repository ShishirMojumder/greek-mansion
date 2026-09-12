const GOOGLE_REVIEW_URL = "https://g.page/r/CWjzqGR7i7IAEBM/review";

const RADIUS = 44;
const TEXT = "LEAVE US A REVIEW • LEAVE US A REVIEW • ";

export default function ReviewFab() {
  return (
    <a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Leave Greek Mansion a review on Google"
      className="review-fab fixed bottom-6 right-6 z-40 hidden h-[7.5rem] w-[7.5rem] md:flex"
    >
      <span className="review-fab__float relative flex h-full w-full items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-gold/60 bg-navy shadow-2xl shadow-black/40" />

        <svg
          viewBox="0 0 120 120"
          aria-hidden="true"
          className="review-fab__ring absolute inset-0 h-full w-full"
        >
          <defs>
            <path
              id="circle-path"
              d={`M 60,60 m -${RADIUS},0 a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
            />
          </defs>
          <text className="review-fab__text">
            <textPath href="#circle-path" startOffset="0%">
              {TEXT}
            </textPath>
          </text>
        </svg>

        <svg viewBox="0 0 24 24" aria-hidden="true" className="relative z-10 h-7 w-7 drop-shadow-[0_1px_2px_rgba(0,0,0,.35)]">
          <defs>
            <linearGradient id="fab-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B08D1E" />
              <stop offset="28%" stopColor="#EBCE72" />
              <stop offset="52%" stopColor="#C9A227" />
              <stop offset="74%" stopColor="#F4E2A0" />
              <stop offset="100%" stopColor="#C9A227" />
            </linearGradient>
          </defs>
          <path
            d="M12 2.6l2.78 5.63 6.22.9-4.5 4.38 1.06 6.19L12 16.78 6.44 19.7l1.06-6.19L3 9.13l6.22-.9L12 2.6z"
            fill="url(#fab-gold)"
          />
        </svg>
      </span>
    </a>
  );
}
