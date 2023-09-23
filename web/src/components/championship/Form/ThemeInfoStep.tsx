import { Box, Spacer } from "@chakra-ui/react"
import { getDownloadURL, ref } from "firebase/storage"
import Image from "next/image"
import { ChangeEvent, FC, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { FileUpload, useFileUpload } from "~/components/FileUpload"
import { fb } from "~/firebase"
import { useToastCallback } from "~/hooks/useToastCallback"
import { Championship, championshipColors } from "~/shared/firebase/firestore/scheme/championship"
import { FormField } from "./FormField"
import { FormStep } from "./FormStep"
import { InputChampionshipColor } from "./InputChampionshipColor"
import { ControlledFormField, InputStepTypes } from "./type"
import { controlledFormFieldOf, isValidAll } from "./util"

export type ThemeInfoInput = Pick<Championship,
  | "color"
  | "image"
>
type ThemeInfoStepTypes = InputStepTypes<ThemeInfoInput>
type ThemeInfoStepFields = {
  color: ControlledFormField<Championship["color"]>
  image: ControlledFormField<Championship["image"]>
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
  const { upload, props: fileUploadProps } = useFileUpload()
  const [handleUpload] = useToastCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const path = `championships/upload/${uuidv4()}`
      const uploadRef = ref(fb.storage, path)
      await upload(uploadRef, file, { contentType: file.type })
      const url = await getDownloadURL(uploadRef)
      fields.image.onChange(url)
    },
    {
      success: {
        title: "画像をアップロードしました",
      },
      error: {
        title: "画像をアップロードできませんでした",
      },
    }
  )
  return (
    <Box>
      <FormField label="11. カラー" errors={fields.color.errors}>
        <InputChampionshipColor
          color={fields.color.value}
          onChangeColor={fields.color.onChange}
        />
      </FormField>
      <FormField label="12. 画像 (任意)" helperText="大会のトップページなどに表示されるアイキャッチを指定できます。" errors={fields.image.errors}>
        {(fields.image.value != null) &&
          <Image
            src={fields.image.value}
            alt="大会の画像"
            width={300}
            height={300}
          />
        }
        <Spacer height="2" />
        <FileUpload
          onChange={handleUpload}
          {...fileUploadProps}
        />
      </FormField>
    </Box>
  )
}

export const useThemeInfoStep = ({ defaultValue }: ThemeInfoStepTypes["hookOptions"]) => {
  const [color, setColor] = useState(defaultValue.color)
  const [image, setImage] = useState(defaultValue.image)
  const fields: ThemeInfoStepFields = {
    color: controlledFormFieldOf(
      color, setColor,
      {
        errors: e => {
          if (!(championshipColors.includes(color))) e.push("大会のカラーが不正です。")
        },
      }
    ),
    image: controlledFormFieldOf(
      image, setImage,
      {
        errors: () => {/* バリデーションなし */ },
      }
    ),
  }
  return {
    fields,
    isValid: isValidAll(fields),
    get input(): ThemeInfoInput {
      return {
        color,
        image,
      }
    },
    props: {
      input: {
        fields,
      },
    },
  }
}
