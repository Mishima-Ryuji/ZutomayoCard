export const isBlank = (value: unknown): value is null | undefined => {
  return value === null || value === undefined
}
