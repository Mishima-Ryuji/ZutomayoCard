import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC, useRef, useState } from "react"
import { deleteDoc } from "~/firebase"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"

interface ChampionshipDeleteFormProps {
  championship: Championship
}
export const ChampionshipDeleteForm: FC<ChampionshipDeleteFormProps> = ({
  championship,
}) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const handleDelete = async () => {
    await deleteDoc(championship.ref)
    await router.push("/championships")
  }
  return (
    <>
      <VStack alignItems="flex-end">
        <Button colorScheme="red" onClick={() => setShowConfirm(true)}>
          大会を削除する
        </Button>
      </VStack>
      <AlertDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              大会を削除しますか？
              <AlertDialogCloseButton />
            </AlertDialogHeader>
            <AlertDialogBody>
              この操作は元に戻せません。
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button variant="ghost" ref={cancelRef} onClick={() => setShowConfirm(false)}>
                キャンセル
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
