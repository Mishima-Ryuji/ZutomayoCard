import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react"
import { FC, ReactNode } from "react"

interface FormFieldProps {
  label?: ReactNode
  helperText?: ReactNode
  children?: ReactNode
}
export const FormField: FC<FormFieldProps> = ({
  label, helperText, children
}) => {
  return (
    <FormControl mb="6">
      {label !== undefined && <FormLabel>{label}</FormLabel>}
      {children}
      {helperText !== undefined && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
