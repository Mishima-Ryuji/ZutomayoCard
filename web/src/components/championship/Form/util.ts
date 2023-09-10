import { ControlledFormField, FormField } from "./type"

export const controlledFormFieldOf = <T,>(
  value: T,
  onChange: (value: T) => void,
  { isValid }: { isValid: boolean },
): ControlledFormField<T> => ({
  value,
  onChange,
  isValid,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidAll = (fields: Record<string, FormField<any>>): boolean => {
  for (const field of Object.values(fields)) {
    if (!field.isValid) return false
  }
  return true
}
