import { ControlledFormField, FormField } from "./type"

export const controlledFormFieldOf = <T,>(
  value: T,
  onChange: (value: T) => void,
  { errors }: { errors: (e: string[]) => void },
): ControlledFormField<T> => {
  const err: string[] = []
  errors(err)
  return ({
    value,
    onChange,
    isValid: err.length === 0,
    errors: err,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidAll = (fields: Record<string, FormField<any>>): boolean => {
  for (const field of Object.values(fields)) {
    if (!field.isValid) return false
  }
  return true
}
