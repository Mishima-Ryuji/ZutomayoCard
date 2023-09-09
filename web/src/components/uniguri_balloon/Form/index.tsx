import { Alert, AlertIcon, Box, Button, Spinner } from "@chakra-ui/react"
import { FC } from "react"
import { maxTimestamp, minTimestamp } from "~/firebase"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"
import { InputUniguriBalloonButton, useInputUniguriBalloonButton } from "./button"
import { InputUniguriBalloonImage, useInputUniguriBalloonImage } from "./image"
import { InputUniguriBalloonMessage, useInputUniguriBalloonMessage } from "./message"
import { UniguriBalloonPreview } from "./preview"
import { InputUniguriBalloonPublish, useInputUniguriBalloonPublish } from "./publish"
import { useInputUniguriBalloonViewTime } from "./viewTime"

export type UniguriBalloonInput = Pick<UniguriBalloon,
  | "message"
  | "image_url"
  | "enable"
  | "start_at"
  | "end_at"
  | "button"
>

interface UniguriBalloonFormProps {
  defaultValue: Partial<UniguriBalloonInput>
  onSubmit: (uniguriBalloon: UniguriBalloonInput) => void
  isSubmitting: boolean
}
export const UniguriBalloonForm: FC<UniguriBalloonFormProps> = ({ defaultValue, onSubmit, isSubmitting }) => {
  const message = useInputUniguriBalloonMessage({ defaultValue: defaultValue.message ?? "" })
  const imageUrl = useInputUniguriBalloonImage({
    message: message.value,
    defaultValue: defaultValue.image_url ?? null,
  })
  const enable = useInputUniguriBalloonPublish({ defaultValue: defaultValue.enable ?? false })
  const viewTime = useInputUniguriBalloonViewTime({
    enable: enable.value,
    defaultValue: {
      startAt: defaultValue.start_at ?? minTimestamp,
      endAt: defaultValue.end_at ?? maxTimestamp,
    },
  })
  const button = useInputUniguriBalloonButton({ defaultValue: defaultValue.button ?? null })

  const isValid =
    message.isValid
    && imageUrl.isValid
    && enable.isValid
    && viewTime.isValid
    && button.isValid

  const handleSubmit = () => {
    if (!isValid) return
    if (imageUrl.value === null) throw new Error("not impelemnt : imageUrl is null")
    onSubmit({
      message: message.value,
      image_url: imageUrl.value,
      enable: enable.value,
      start_at: viewTime.startAt,
      end_at: viewTime.endAt,
      button: button.value,
    })
  }

  return (
    <div>
      <InputUniguriBalloonMessage
        label="1. うにぐりくんのセリフ"
        {...message.props}
      />
      <InputUniguriBalloonImage
        label="2. 画像"
        {...imageUrl.props}
      />
      <InputUniguriBalloonButton
        label="3. ボタン(任意)"
        {...button.props}
      />
      <InputUniguriBalloonPublish
        label="4. 公開設定"
        {...enable.props}
      />
      {/* <InputUniguriBalloonViewTime
      {...viewTime.props}
      /> */}

      {imageUrl.value !== null &&
        <UniguriBalloonPreview
          label="5. プレビュー"
          message={message.value}
          button={button.value}
          imageUrl={imageUrl.value}
        />
      }

      <Box my={4}>
        {enable.value
          ? viewTime.inLimit
            ? <Alert status='info'>
              <AlertIcon />
              公開されます
            </Alert>
            : <Alert status='warning'>
              <AlertIcon />
              期間外のため 公開されません
            </Alert>
          : <Alert status='warning'>
            <AlertIcon />
            非公開設定になっているため 公開されません
          </Alert>
        }
      </Box>

      <Button
        colorScheme="purple"
        onClick={handleSubmit}
        isDisabled={!isValid || isSubmitting}
        rightIcon={
          isSubmitting ? <Spinner /> : undefined
        }
      >
        更新
      </Button>

    </div>
  )
}
