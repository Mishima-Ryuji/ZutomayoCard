import { Box, Button, Textarea } from "@chakra-ui/react"
import { FC, useState } from "react"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { FormField } from "./FormField"
import { FormStep } from "./FormStep"
import { Suggest, SuggestButton } from "./Suggest"
import { ControlledFormField, InputStepTypes } from "./type"
import { controlledFormFieldOf, isValidAll } from "./util"

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

const formatSuggestions = ["トーナメント", "総当たり", "スイスドロー", "ダブルエリミネーション"]

export interface InputOptionalInfoStepProps {
  fields: OptionalInfoFields
}
export const InputOptionalInfoStep: FC<InputOptionalInfoStepProps> = ({
  fields
}) => {
  return (
    <Box>
      <FormField label="5. 大会形式" errors={fields.format.errors}>
        <Textarea
          value={fields.format.value}
          onChange={e => fields.format.onChange(e.target.value)}
          isInvalid={!fields.format.isValid}
          placeholder="例) トーナメント"
        />
        <Suggest>
          {formatSuggestions.map(format =>
            <Button key={format} size="xs" onClick={() => fields.format.onChange(fields.format.value + format)}>
              {format}
            </Button>
          )}
        </Suggest>

      </FormField>

      <FormField label="6. 参加費" errors={fields.entry_fee.errors}>
        <Textarea
          value={fields.entry_fee.value}
          onChange={e => fields.entry_fee.onChange(e.target.value)}
          isInvalid={!fields.entry_fee.isValid}
          placeholder="例) 無料、20000円÷参加人数"
        />
        <Suggest>
          <SuggestButton onClick={() => fields.entry_fee.onChange(fields.entry_fee.value + "無料")}>
            無料
          </SuggestButton>
        </Suggest>
      </FormField>

      <FormField label="7. 持ち物" errors={fields.need_items.errors}>
        <Textarea
          value={fields.need_items.value}
          onChange={e => fields.need_items.onChange(e.target.value)}
          isInvalid={!fields.need_items.isValid}
          placeholder="例) デッキ、しゃもじ"
        />
        <Suggest>
          <SuggestButton onClick={() => fields.need_items.onChange(fields.need_items.value + "デッキ")}>
            デッキ
          </SuggestButton>
        </Suggest>
      </FormField>

      <FormField label="8. その他 注意事項" errors={fields.detail.errors}>
        <Textarea
          value={fields.detail.value}
          onChange={e => fields.detail.onChange(e.target.value)}
          isInvalid={!fields.detail.isValid}
          placeholder="例) 集まれ！腕に自信のあるずとまろ！"
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
      { errors: () => void 0 },
    ),
    entry_fee: controlledFormFieldOf(
      entryFee, setEntryFee,
      { errors: () => void 0 },
    ),
    need_items: controlledFormFieldOf(
      needItems, setNeedItems,
      { errors: () => void 0 },
    ),
    detail: controlledFormFieldOf(
      detail, setDetail,
      { errors: () => void 0 },
    ),
  }
  return {
    fields,
    isValid: isValidAll(fields),
    get input(): OptionalInfoInput {
      return {
        format,
        entry_fee: entryFee,
        need_items: needItems,
        detail,
      }
    },
    props: {
      input: {
        fields,
      } satisfies InputOptionalInfoStepProps,
    },
  }
}
