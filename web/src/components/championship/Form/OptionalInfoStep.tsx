import { Box, Textarea } from "@chakra-ui/react"
import { FC, useState } from "react"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { FormField } from "./FormField"
import { FormStep } from "./FormStep"
import { isValidAll } from "./util"
import { ControlledFormField, InputStepTypes } from "./type"
import { controlledFormFieldOf } from "./util"

export type OptionalInfoInput = Pick<Championship,
  | "format"
  | "entry_fee"
  | "need_items"
  | "detail"
>
type OptionalInfoStepTypes = InputStepTypes<OptionalInfoInput>
type OptionalInfoFields = {
  format: ControlledFormField<string>
  entry_fee: ControlledFormField<string>
  need_items: ControlledFormField<string>
  detail: ControlledFormField<string>
}

export const OptionalInfoStep: FC = () => {
  return (
    <FormStep
      title="補足情報"
    />
  )
}

export interface InputOptionalInfoStepProps {
  fields: OptionalInfoFields
}
export const InputOptionalInfoStep: FC<InputOptionalInfoStepProps> = ({
  fields
}) => {
  return (
    <Box>
      <FormField label="5. 大会形式">
        <Textarea
          value={fields.format.value}
          onChange={e => fields.format.onChange(e.target.value)}
          isInvalid={!fields.format.isValid}
        />
      </FormField>

      <FormField label="6. 参加費">
        <Textarea
          value={fields.entry_fee.value}
          onChange={e => fields.entry_fee.onChange(e.target.value)}
          isInvalid={!fields.entry_fee.isValid}
        />
      </FormField>

      <FormField label="7. 持ち物">
        <Textarea
          value={fields.need_items.value}
          onChange={e => fields.need_items.onChange(e.target.value)}
          isInvalid={!fields.need_items.isValid}
        />
      </FormField>

      <FormField label="8. その他 注意事項">
        <Textarea
          value={fields.detail.value}
          onChange={e => fields.detail.onChange(e.target.value)}
          isInvalid={!fields.detail.isValid}
        />
      </FormField>
    </Box>
  )
}

export const useOptionalInfoStep = ({ defaultValue }: OptionalInfoStepTypes["hookOptions"]) => {
  const [format, setFormat] = useState(defaultValue.format)
  const [entryFee, setEntryFee] = useState(defaultValue.entry_fee)
  const [needItems, setNeedItems] = useState(defaultValue.need_items)
  const [detail, setDetail] = useState(defaultValue.detail)
  const fields: OptionalInfoFields = {
    format: controlledFormFieldOf(
      format, setFormat,
      { isValid: true },
    ),
    entry_fee: controlledFormFieldOf(
      entryFee, setEntryFee,
      { isValid: true },
    ),
    need_items: controlledFormFieldOf(
      needItems, setNeedItems,
      { isValid: true },
    ),
    detail: controlledFormFieldOf(
      detail, setDetail,
      { isValid: true },
    ),
  }
  return {
    fields,
    isValid: isValidAll(fields),
    props: {
      input: {
        fields,
      } satisfies InputOptionalInfoStepProps,
    },
  }
}
