export type Designed<
  P extends Record<string, unknown> = Record<string, unknown>
> = {
  className?: string
  style?: React.CSSProperties
} & P
