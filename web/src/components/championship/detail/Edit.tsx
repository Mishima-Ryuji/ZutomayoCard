import { Alert, AlertIcon, AlertTitle, Box, Button, Spacer } from "@chakra-ui/react"
import { FC } from "react"
import { Timestamp, updateDoc } from "~/firebase"
import { useToastCallback } from "~/hooks/useToastCallback"
import { Championship, championshipRef } from "~/shared/firebase/firestore/scheme/championship"
import { InputBasicInfoStep, useBasicInfoStep } from "../Form/BasicInfoStep"
import { InputHostInfoStep, useHostInfoStep } from "../Form/HostInfoStep"
import { InputOptionalInfoStep, useOptionalInfoStep } from "../Form/OptionalInfoStep"
import { InputThemeInfoStep, useThemeInfoStep } from "../Form/ThemeInfoStep"

interface ChampionshipEditFormProps {
  defaultValue: Championship
}
export const ChampionshipEditForm: FC<ChampionshipEditFormProps> = ({ defaultValue }) => {
  const basicInfo = useBasicInfoStep({ defaultValue })
  const optionalInfo = useOptionalInfoStep({ defaultValue })
  const hostInfo = useHostInfoStep({ defaultValue })
  const themeInfo = useThemeInfoStep({ defaultValue })
  const isValid = basicInfo.isValid
    && optionalInfo.isValid
    && hostInfo.isValid
    && themeInfo.isValid
  const [handleSave, isSaving] = useToastCallback(
    async () => {
      if (!isValid) return
      await updateDoc(championshipRef(defaultValue.id), {
        ...basicInfo.input,
        ...optionalInfo.input,
        ...hostInfo.input,
        ...themeInfo.input,
      })
    },
    {
      success: {
        title: "OK",
        description: "大会情報を更新しました！",
      },
    }
  )

  const isHold = defaultValue.hold_at < Timestamp.now()

  return (
    <Box>
      {isHold &&
        <Alert status="warning" my="4">
          <AlertIcon />
          <AlertTitle>
            終了した大会の情報は編集できません
          </AlertTitle>
        </Alert>
      }
      <InputBasicInfoStep {...basicInfo.props.input} isDisabled={isHold} />
      <InputOptionalInfoStep {...optionalInfo.props.input} isDisabled={isHold} />
      <InputHostInfoStep {...hostInfo.props.input} isDisabled={isHold} />
      <InputThemeInfoStep {...themeInfo.props.input} isDisabled={isHold} />
      <Spacer height="8" />
      <Button colorScheme="purple" isDisabled={!isValid || isSaving} onClick={handleSave}>
        更新
      </Button>
    </Box>
  )
}
