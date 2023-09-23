import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react"
import { FC, ReactNode } from "react"

interface FormFieldProps {
  label?: ReactNode
  helperText?: ReactNode
  errors?: string[]
  children?: ReactNode
  isDisabled?: boolean
}
export const FormField: FC<FormFieldProps> = ({
  label, helperText, errors, children,
  isDisabled = false,
}) => {
  return (
    <FormControl mb="6" isInvalid={errors && errors.length >= 1} isDisabled={isDisabled}>
      {label !== undefined && <FormLabel>{label}</FormLabel>}
      {children}
      {helperText !== undefined && <FormHelperText>{helperText}</FormHelperText>}
      {!isDisabled && errors?.map(error =>
        <FormErrorMessage key={error}>
          {error}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}
