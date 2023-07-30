import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react'
import {
  AuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { useEffect } from 'react'
import { FaGoogle, FaTwitter } from 'react-icons/fa'
import { fb } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'

const googleProvider = new GoogleAuthProvider()
const twitterProvider = new TwitterAuthProvider()

type Props = {
  show: boolean
  onHide: () => void
}

export const LoginPopup = ({ onHide: handleHide, show }: Props) => {
  const { user, loading } = useAuthState()
  const toast = useToast()
  const handleClick = async (provider: AuthProvider) => {
    try {
      await signInWithPopup(fb.auth, provider)
      toast({
        title: 'Zutomayo Card Wiki',
        description: 'ログインに成功しました。',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      handleHide()
      toast({
        title: 'Zutomayo Card Wiki',
        description: 'ログインに失敗しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    if (user) handleHide()
  }, [user])

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={!user && !loading ? show : false}
      onClose={handleHide}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ログイン</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text mb={4}>
            ログインをすると、デッキ構築機能やトレード相手の検索機能などのZutomayo
            Card Wikiの全ての機能が利用できるようになります。
          </Text>
          <HStack>
            <Button
              colorScheme="red"
              onClick={() => handleClick(googleProvider)}
              leftIcon={<FaGoogle />}
            >
              Google
            </Button>
            <Button
              colorScheme="twitter"
              onClick={() => handleClick(twitterProvider)}
              leftIcon={<FaTwitter />}
            >
              Twitter
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
