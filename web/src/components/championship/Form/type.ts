import { BasicInfoInput } from "./BasicInfoStep"
import { HostInfoInput } from "./HostInfoStep"
import { OptionalInfoInput } from "./OptionalInfoStep"
import { ThemeInfoInput } from "./ThemeInfoStep"

export interface UseInputStepOptions<Input> {
  defaultValue: Input
}

export interface InputStepTypes<Input> {
  hookOptions: UseInputStepOptions<Input>
}

export interface ControlledFormField<T> {
  value: T
  onChange: (value: T) => void
  isValid: boolean
}

export interface UncontrolledFormField<T> {
  getValue(): T
  isValid: boolean
}

export type FormField<T> = ControlledFormField<T> | UncontrolledFormField<T>


export type ChampionshipInput =
  BasicInfoInput
  & OptionalInfoInput
  & HostInfoInput
  & ThemeInfoInput
