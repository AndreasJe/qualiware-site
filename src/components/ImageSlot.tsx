import type { Media } from '../payload-types'

export type SlotValue = {
  media?: (number | null) | Media
  placeholder?: string | null
} | null

/**
 * Renders an uploaded image when one exists, otherwise the labelled placeholder
 * that carries the shot brief from the design handoff.
 */
export const ImageSlot = ({
  slot,
  className,
  style,
  alt,
}: {
  slot?: SlotValue
  className?: string
  style?: React.CSSProperties
  alt?: string
}) => {
  const media = slot?.media && typeof slot.media === 'object' ? slot.media : null

  if (media?.url) {
    return (
      <img
        src={media.url}
        alt={alt ?? media.alt ?? ''}
        width={media.width ?? undefined}
        height={media.height ?? undefined}
        className={className}
        style={{ objectFit: 'cover', ...style }}
      />
    )
  }

  return (
    <div className={`qw-slot ${className ?? ''}`} style={style}>
      <span>{slot?.placeholder || 'IMAGE'}</span>
    </div>
  )
}
