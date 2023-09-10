import { Box, Input, Textarea } from "@chakra-ui/react"
import { FC, useState } from "react"
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
      <FormField label="9. 主催者名">
        <Input
          value={fields.host_name.value}
          onChange={e => fields.host_name.onChange(e.target.value)}
          isInvalid={!fields.host_name.isValid}
        />
      </FormField>

      <FormField label="10. 主催者の連絡先">
        <Textarea
          value={fields.host_contact.value}
          onChange={e => fields.host_contact.onChange(e.target.value)}
          isInvalid={!fields.host_contact.isValid}
        />
      </FormField>
    </Box>
  )
}

export const useHostInfoStep = ({ defaultValue }: HostInfoStepTypes["hookOptions"]) => {
  const [hostUid, setHostUid] = useState(defaultValue.host_uid)
  const [hostName, setHostName] = useState(defaultValue.host_name)
  const [hostContact, setHostContact] = useState(defaultValue.host_contact)
  const fields: HostInfoStepFields = {
    host_uid: controlledFormFieldOf(
      hostUid, setHostUid,
      { isValid: hostUid !== "" }
    ),
    host_name: controlledFormFieldOf(
      hostName, setHostName,
      { isValid: hostName.trim() !== "" }
    ),
    host_contact: controlledFormFieldOf(
      hostContact, setHostContact,
      { isValid: hostContact.trim() !== "" }
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
