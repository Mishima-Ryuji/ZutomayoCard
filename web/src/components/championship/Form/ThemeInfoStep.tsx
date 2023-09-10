import { Box } from "@chakra-ui/react"
import { FC, useState } from "react"
import { Championship, championshipColors } from "~/shared/firebase/firestore/scheme/championship"
import { FormField } from "./FormField"
import { FormStep } from "./FormStep"
import { InputChampionshipColor } from "./InputChampionshipColor"
import { ControlledFormField, InputStepTypes } from "./type"
import { controlledFormFieldOf, isValidAll } from "./util"

export type ThemeInfoInput = Pick<Championship,
  | "color"
>
type ThemeInfoStepTypes = InputStepTypes<ThemeInfoInput>
type ThemeInfoStepFields = {
  color: ControlledFormField<Championship["color"]>
}

export const ThemeInfoStep: FC = () => {
  return (
    <FormStep
      title="カラー"
    />
  )
}

interface InputThemeInfoStepProps {
  fields: ThemeInfoStepFields
}
export const InputThemeInfoStep: FC<InputThemeInfoStepProps> = ({
  fields,
}) => {
  return (
    <Box>
      <FormField label="11. カラー">
        <InputChampionshipColor
          color={fields.color.value}
          onChangeColor={fields.color.onChange}
        />
      </FormField>
    </Box>
  )
}

export const useThemeInfoStep = ({ defaultValue }: ThemeInfoStepTypes["hookOptions"]) => {
  const [color, setColor] = useState(defaultValue.color)
  const fields: ThemeInfoStepFields = {
    color: controlledFormFieldOf(
      color, setColor,
      {
        errors: e => {
          if (!(championshipColors.includes(color))) e.push("大会のカラーが不正です。")
        },
      }
    ),
  }
  return {
    fields,
    isValid: isValidAll(fields),
    get input(): ThemeInfoInput {
      return {
        color,
      }
    },
    props: {
      input: {
        fields,
      },
    },
  }
}
