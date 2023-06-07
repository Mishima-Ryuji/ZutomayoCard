// removeした型をaddで復元することが出来る
// Omitでは同じ挙動は出来ない

export type Remove<T, U> = {
  [key in keyof T as key extends U ? never : key]: T[key]
}

export const add = <T, U extends keyof T>(
  map: Remove<T, U>,
  addition: {
    [key in U]: T[key]
  }
): T => {
  const result = { ...map } as T
  for (const key in addition) {
    result[key] = addition[key]
  }
  return result
}

export const remove = <T, U extends keyof T>(
  map: T,
  keyList: U[]
): Remove<T, U> => {
  const result = { ...map }
  for (const key of keyList) {
    delete result[key]
  }
  return result as Remove<T, U>
}
