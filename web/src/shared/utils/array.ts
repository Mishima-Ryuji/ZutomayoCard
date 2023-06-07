export const unique = <T>(array: T[]): T[] => {
  const result: T[] = []
  for (const e of array) {
    if (result.includes(e)) continue
    result.push(e)
  }
  return result
}

export const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
  const subArrayCount = Math.ceil(arr.length / chunkSize)
  const result = new Array(subArrayCount)
  for (let i = 0; i < subArrayCount; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    result[i] = arr.slice(start, end)
  }
  return result
}

export const range: {
  (start: number, end: number): number[]
  (end: number): number[]
} = (first: number, second?: number) => {
  const array = []
  const start = second ? first : 0
  const end = second ? second : first
  for (let i = start; i < end; i++) {
    array.push(i)
  }
  return array
}

export const random = <T>(array: T[]): T => {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}
