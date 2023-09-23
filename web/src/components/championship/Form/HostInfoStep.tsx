import { Box, Input, Textarea } from "@chakra-ui/react"
import { FC, useState } from "react"
import { useUserDataEffect } from "~/hooks/useUserDataEffect"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { FormField } from "./FormField"
import { FormStep } from "./FormStep"
import { ControlledFormField, InputStepTypes } from "./type"
import { controlledFormFieldOf, isValidAll } from "./util"

export type HostInfoInput = Pick<Championship,
  | "host_uid"
  | "host_name"
  | "host_contact"
>
type HostInfoStepTypes = InputStepTypes<HostInfoInput>
type HostInfoStepFields = {
  host_uid: ControlledFormField<string>
  host_name: ControlledFormField<string>
  host_contact: ControlledFormField<string>
}

export const HostInfoStep: FC = () => {
  return (
    <FormStep
      title="主催者情報"
    />
  )
}

interface InputHostInfoStepProps {
  fields: HostInfoStepFields
}
export const InputHostInfoStep: FC<InputHostInfoStepProps> = ({
  fields,
}) => {
  return (
    <Box>
      <FormField label="9. 主催者名" errors={fields.host_name.errors}>
        <Input
          value={fields.host_name.value}
          onChange={e => fields.host_name.onChange(e.target.value)}
          isInvalid={!fields.host_name.isValid}
          placeholder="例) ずと まよお"
        />
      </FormField>

      <FormField label="10. 主催者の連絡先" errors={fields.host_contact.errors}>
        <Textarea
          value={fields.host_contact.value}
          onChange={e => fields.host_contact.onChange(e.target.value)}
          isInvalid={!fields.host_contact.isValid}
          placeholder="例) メール:uniguri@gmail.com、Twitter:@zutomayolove"
        />
      </FormField>
    </Box>
  )
}

export const useHostInfoStep = ({ defaultValue }: HostInfoStepTypes["hookOptions"]) => {
  const [hostUid, setHostUid] = useState(defaultValue.host_uid)
  const [hostName, setHostName] = useState(defaultValue.host_name)
  const [hostContact, setHostContact] = useState(defaultValue.host_contact)
  useUserDataEffect(userData => {
    setHostUid(userData.uid)
    if (userData.name !== undefined) setHostName(userData.name)
    if (userData.contact !== undefined) setHostContact(userData.contact)
  })
  const fields: HostInfoStepFields = {
    host_uid: controlledFormFieldOf(
      hostUid, setHostUid,
      {
        errors: e => {
          if (hostUid === "") e.push("ログインする必要があります。")
        },
      }
    ),
    host_name: controlledFormFieldOf(
      hostName, setHostName,
      {
        errors: e => {
          if (hostName.trim() === "") e.push("主催者名は必須です。")
        },
      }
    ),
    host_contact: controlledFormFieldOf(
      hostContact, setHostContact,
      {
        errors: e => {
          if (hostContact.trim() === "") e.push("主催者の連絡先は必須です。")
        },
      }
    ),
  }
  return {
    fields,
    isValid: isValidAll(fields),
    get input(): HostInfoInput {
      return {
        host_uid: hostUid,
        host_name: hostName,
        host_contact: hostContact,
      }
    },
    props: {
      input: {
        fields,
      },
    },
  }
}
