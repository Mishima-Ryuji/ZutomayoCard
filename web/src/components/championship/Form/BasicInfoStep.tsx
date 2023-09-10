import { Box, Input, Textarea } from "@chakra-ui/react"
import { FC, useState } from "react"
import { InputTimestamp } from "~/components/InputTimestamp"
import { Timestamp } from "~/firebase"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { FormField } from "./FormField"
import { FormStep } from "./FormStep"
import { ControlledFormField, InputStepTypes } from "./type"
import { controlledFormFieldOf, isValidAll } from "./util"

export type BasicInfoInput = Pick<Championship,
  | "name"
  | "hold_at"
  | "place"
  | "time_limit_at"
>
type BasicInfoStepTypes = InputStepTypes<BasicInfoInput>
type BasicInfoStepFields = {
  name: ControlledFormField<string>
  hold_at: ControlledFormField<Timestamp>
  place: ControlledFormField<string>
  time_limit_at: ControlledFormField<Timestamp>
}

export const BasicInfoStep: FC = () => {
  return (
    <FormStep
      title="大会情報"
    />
  )
}

interface InputBasicInfoStepProps {
  fields: BasicInfoStepFields
}
export const InputBasicInfoStep: FC<InputBasicInfoStepProps> = ({
  fields,
}) => {
  return (
    <Box>
      <FormField label="1. 大会名">
        <Input
          value={fields.name.value}
          onChange={e => fields.name.onChange(e.target.value)}
          isInvalid={!fields.name.isValid}
        />
      </FormField>

      <FormField label="2. 開催日">
        <InputTimestamp
          value={fields.hold_at.value}
          onChange={holdAt => fields.hold_at.onChange(holdAt)}
          isInvalid={!fields.hold_at.isValid}
        />
      </FormField>

      <FormField label="3. 開催場所">
        <Textarea
          value={fields.place.value}
          onChange={e => fields.place.onChange(e.target.value)}
          isInvalid={!fields.place.isValid}
        />
      </FormField>

      <FormField label="4. 申し込み締切日">
        <InputTimestamp
          value={fields.time_limit_at.value}
          onChange={holdAt => fields.time_limit_at.onChange(holdAt)}
          isInvalid={!fields.time_limit_at.isValid}
        />
      </FormField>

    </Box>
  )
}

export const useBasicInfoStep = ({ defaultValue }: BasicInfoStepTypes["hookOptions"]) => {
  const [name, setName] = useState(defaultValue.name)
  const [holdAt, setHoldAt] = useState(defaultValue.hold_at)
  const [place, setPlace] = useState(defaultValue.place)
  const [timeLimitAt, setTimeLimitAt] = useState(defaultValue.time_limit_at)
  const fields: BasicInfoStepFields = {
    name: controlledFormFieldOf(
      name, setName,
      {
        errors: e => {
          if (name.trim() === "") e.push("大会名は必須です。")
        },
      },
    ),
    hold_at: controlledFormFieldOf(
      holdAt, setHoldAt,
      {
        errors: e => {
          if (holdAt < Timestamp.now()) e.push("現在よりも後の日付を入力する必要があります。")
        },
      },
    ),
    place: controlledFormFieldOf(
      place, setPlace,
      {
        errors: e => {
          if (place.trim() === "") e.push("開催場所は必須です。")
        },
      },
    ),
    time_limit_at: controlledFormFieldOf(
      timeLimitAt, setTimeLimitAt,
      {
        errors: e => {
          if (timeLimitAt < Timestamp.now()) e.push("現在よりも後の日付を入力する必要があります。")
          if (holdAt.valueOf() < timeLimitAt.valueOf()) e.push("開催日よりも前の時刻を入力する必要があります。")
        },
      },
    ),
  }
  return {
    fields,
    isValid: isValidAll(fields),
    get input(): BasicInfoInput {
      return {
        name,
        hold_at: holdAt,
        place,
        time_limit_at: timeLimitAt,
      }
    },
    props: {
      input: {
        fields,
      } satisfies InputBasicInfoStepProps,
    },
  }
}
