import { useDisclosure, Button, Spinner, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"
import { FC, ReactNode, useRef } from "react"

interface DeleteButtonProps {
  dialogMessage: ReactNode
  onDelete: () => void
  isDeleting: boolean
}
export const DeleteButton: FC<DeleteButtonProps> = ({ dialogMessage, isDeleting, onDelete }) => {
  const dialog = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleDelete = () => {
    dialog.onClose()
    onDelete()
  }
  return (
    <>
      <Button
        size="sm"
        colorScheme="red"
        onClick={dialog.onOpen}
        isDisabled={isDeleting}
        leftIcon={isDeleting ? <Spinner /> : undefined}
      >
        削除する
      </Button>
      <AlertDialog isOpen={dialog.isOpen} onClose={dialog.onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogCloseButton />
            </AlertDialogHeader>
            <AlertDialogBody>
              {dialogMessage}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} colorScheme='gray' onClick={dialog.onClose}>
                キャンセル
              </Button>
              <Button colorScheme='red' onClick={handleDelete}>
                削除する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
