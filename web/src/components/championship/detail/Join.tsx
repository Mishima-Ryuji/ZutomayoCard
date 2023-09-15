import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, HStack, Heading, Input, Stack, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import { FC, useState } from "react"
import { useDocument } from "react-firebase-hooks/firestore"
import { LoginPopup } from "~/components/auth/LoginPopup"
import { createDoc, deleteDoc } from "~/firebase"
import { useAuthState } from "~/hooks/useAuthState"
import { useToastCallback } from "~/hooks/useToastCallback"
import { useUserDataEffect } from "~/hooks/useUserDataEffect"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { participantRef } from "~/shared/firebase/firestore/scheme/championship/participant"
import { FormField } from "../Form/FormField"
import { controlledFormFieldOf } from "../Form/util"

interface JoinChampionshipFormProps {
  championship: Championship
}
export const JoinChampionshipForm: FC<JoinChampionshipFormProps> = ({ championship }) => {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [detail, setDetail] = useState("")

  const fields = {
    name: controlledFormFieldOf(name, setName, {
      errors: errors => {
        if (name.trim() === "") errors.push("名前は必須です。")
      },
    }),
    contact: controlledFormFieldOf(contact, setName, {
      errors: errors => {
        if (contact.trim() === "") errors.push("連絡先は必須です。")
      },
    }),
    detail: controlledFormFieldOf(detail, setName, {
      errors: () => { /* バリデーションなし */ },
    }),
  }
  const isValid = fields.name.isValid
    && fields.contact.isValid
    && fields.detail.isValid

  const authState = useAuthState()
  const notLogin = (!authState.loading && authState.user === null)

  const userId = authState.user?.uid
  const [participant] = useDocument(typeof userId === "string"
    ? participantRef(championship.id, userId)
    : null
  )
  const isJoined = participant?.exists() ?? false

  // ログイン情報をもとに自動入力
  useUserDataEffect(userData => {
    if (name === "" && userData.name !== undefined) setName(userData.name)
    if (contact === "" && userData.contact !== undefined) setContact(userData.contact)
  })

  const handleLogin = () => {
    loginPopup.onOpen()
  }
  const loginPopup = useDisclosure()

  const [handleSubmit, isSubmitting] = useToastCallback(
    async () => {
      const uid = authState.user?.uid
      if (uid === undefined) {
        return
      }
      await createDoc(participantRef(championship.id, uid), {
        name,
        contact,
        detail,
        uid,
      })
    },
    {
      success: {
        title: championship.name + " に応募",
        description: isJoined ? "応募内容を更新しました。" : "応募が完了しました。",
      },
    },
  )

  const [handleCancel, isCanceling] = useToastCallback(
    async () => {
      const uid = authState.user?.uid
      if (uid === undefined) {
        return
      }
      console.log(championship.id, uid)
      await deleteDoc(participantRef(championship.id, uid))
      console.log()
    },
    {
      success: {
        title: "キャンセル完了",
        description: "応募をキャンセルしました",
      },
      error: {
        title: "エラー",
        description: "キャンセルできませんでした。もう一度キャンセルし直してください。",
      },
    },
  )

  return (
    <Box>
      <Heading size="lg" mb="3">
        {championship.name}
        {isJoined ? "の応募内容" : "に応募"}
      </Heading>

      {notLogin
        ? <Alert status="warning" my="3">
          <AlertIcon />
          <Stack>
            <AlertTitle>
              ログインしていません！
            </AlertTitle>
            <AlertDescription>
              大会に応募するにはログインする必要があります。
            </AlertDescription>
            <HStack flexWrap="wrap">
              <Button colorScheme="purple" onClick={handleLogin}>
                ログインする
              </Button>
            </HStack>
          </Stack>
        </Alert>
        : <>
          <FormField
            label="名前"
            errors={fields.name.errors}
          >
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormField>

          <FormField
            label="連絡先"
            helperText="Twitterやメールアドレスなど公開しても問題のないものを入力してください。"
            errors={fields.contact.errors}
          >
            <Textarea
              value={contact}
              onChange={e => setContact(e.target.value)}
            />
          </FormField>

          <FormField
            label="メッセージ"
            errors={fields.detail.errors}
          >
            <Textarea
              value={detail}
              onChange={e => setDetail(e.target.value)}
            />
          </FormField>

          <VStack w="full" alignItems="center" mt="12">
            <Button
              size="lg"
              colorScheme={championship.color}
              isDisabled={!isValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isJoined ? "応募内容を更新" : "応募確定"}
            </Button>
            {isJoined &&
              <Button
                variant="outline"
                colorScheme={championship.color}
                onClick={handleCancel}
                isDisabled={isCanceling}
              >
                応募をキャンセル
              </Button>
            }
          </VStack>
        </>
      }
      <LoginPopup
        show={loginPopup.isOpen}
        onHide={loginPopup.onClose}
      />

    </Box>
  )
}
