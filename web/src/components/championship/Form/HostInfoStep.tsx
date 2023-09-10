import { Box, Input, Textarea } from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import { getDoc, profileRef } from "~/firebase"
import { useAuthState } from "~/hooks/useAuthState"
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
  const { user, loading } = useAuthState()
  useEffect(() => {
    if (loading || !user) return
    (async () => {
      // useAuthStateのprofileを使うとprofileをloading中なのにprofileLoadingがfalseになってしまうため手動で取得
      const snapshot = await getDoc(profileRef(user.uid))
      const profile = snapshot.data()
      setHostUid(user.uid)
      if (profile) {
        // profile
        setHostName(profile.name)
        setHostContact(profile.contact)
      } else {
        if (user.displayName !== null) setHostName(user.displayName)
        if (user.email !== null && user.emailVerified) setHostContact(user.email)
      }
    })()
  }, [loading, user])
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
