/**
 * The signature motif: a horizontal line with a chevron head, always pointing
 * right. Neon on dark and on white buttons, dark green on ice blue.
 */
export const Arrow = ({
  width = 26,
  stroke = 'var(--qw-neon)',
  strokeWidth = 1.8,
  className,
}: {
  width?: number
  stroke?: string
  strokeWidth?: number
  className?: string
}) => (
  <svg
    width={width}
    height={(width / 26) * 8}
    viewBox="0 0 26 8"
    fill="none"
    aria-hidden="true"
    className={className}
    style={{ flexShrink: 0 }}
  >
    <path d="M0 4h22M18.5 1L22 4l-3.5 3" stroke={stroke} strokeWidth={strokeWidth} />
  </svg>
)

/** Downward scroll cue at the bottom of the hero. */
export const ScrollCue = ({ stroke = 'var(--qw-neon)' }: { stroke?: string }) => (
  <svg
    width="16"
    height="40"
    viewBox="0 0 16 40"
    fill="none"
    aria-hidden="true"
    className="qw-anim-bob"
  >
    <path d="M8 0v32M2 26l6 6 6-6" stroke={stroke} strokeWidth="1.8" />
  </svg>
)

/** Chevron used by nav triggers and the docs tree. */
export const Chevron = ({
  size = 9,
  stroke = 'var(--qw-green)',
  open = false,
}: {
  size?: number
  stroke?: string
  open?: boolean
}) => (
  <svg
    width={size}
    height={(size / 9) * 6}
    viewBox="0 0 9 6"
    fill="none"
    aria-hidden="true"
    style={{
      flexShrink: 0,
      transform: open ? 'rotate(180deg)' : undefined,
      transition: 'transform 0.15s ease',
    }}
  >
    <path d="M1 1l3.5 3.5L8 1" stroke={stroke} strokeWidth="1.4" />
  </svg>
)
