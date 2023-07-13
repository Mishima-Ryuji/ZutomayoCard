import {
  AspectRatio,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { deleteField, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import Youtube from 'react-youtube'
import { Card } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'

type Props = {
  card: Card
}

export const YouTubeMovie = ({ card }: Props) => {
  const { isAdmin } = useAuthState()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [youtubeURL, setYouTubeURL] = useState<string>(
    card.youtube_id !== undefined
      ? `https://www.youtube.com/watch?v=${card.youtube_id}`
      : ''
  )

  if (!isAdmin && (card.youtube_id === undefined || card.youtube_id === ''))
    return <></>

  return (
    <Box>
      <Heading size="md" mb={4}>
        動画解説
      </Heading>
      {card.youtube_id !== undefined ? (
        <AspectRatio width={'100%'} maxW={640} ratio={640 / 360}>
          <Youtube
            videoId={card.youtube_id}
            opts={{ width: '100%', height: '100%' }}
          />
        </AspectRatio>
      ) : (
        <Box>{`現在準備中です。`}</Box>
      )}
      {isAdmin && (
        <>
          <Flex gap={3}>
            <Button
              colorScheme="purple"
              size="xs"
              mt={7}
              onClick={onOpen}
              gap={1}
            >
              <FaPencilAlt />
              YouTubeの動画の登録
            </Button>
            {card.youtube_id !== undefined && (
              <Button
                colorScheme="red"
                size="xs"
                mt={7}
                onClick={async () => {
                  const confirmed =
                    window.confirm('本当に動画解説を削除しますか？')
                  if (!confirmed) return
                  await updateDoc(card.ref, {
                    youtube_id: deleteField(),
                  })
                }}
              >
                <FaPencilAlt />
                YouTubeの動画を削除
              </Button>
            )}
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>YouTubeの動画</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack gap={5}>
                  <FormControl>
                    <FormLabel>URL</FormLabel>
                    <Input
                      placeholder="URLを入力してください"
                      defaultValue={youtubeURL}
                      onChange={(e) => setYouTubeURL(e.currentTarget.value)}
                    />
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="purple"
                  onClick={async () => {
                    if (!youtubeURL)
                      throw new Error('Unexpected error has ocurred.')
                    const youtubeIdCap = /v=(.+)$/.exec(youtubeURL)
                    if (!youtubeIdCap) {
                      alert('URLが不正です。')
                      return
                    }
                    await updateDoc(card.ref, {
                      youtube_id: youtubeIdCap[1],
                    })
                    onClose()
                  }}
                  isDisabled={!youtubeURL}
                >
                  更新
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  )
}
