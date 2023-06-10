import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaPencilAlt, FaPlus, FaTrash } from 'react-icons/fa'
import {
  Question,
  addDoc,
  deleteDoc,
  questionsRef,
  updateDoc,
} from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'

type QuestionWriterProps = {
  question?: Question
  baseCardId?: string
  mt?: number
}

const QuestionWriter = ({ question, baseCardId, mt }: QuestionWriterProps) => {
  const { isAdmin } = useAuthState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState(question?.title ?? '')
  const [answer, setAnswer] = useState(question?.answer ?? '')

  if (!isAdmin) return <></>
  return (
    <Box mt={mt}>
      <Button colorScheme="purple" size="xs" onClick={onOpen}>
        <Flex align={'center'} gap={1}>
          {question ? (
            <>
              <FaPencilAlt />
              疑問点を編集
            </>
          ) : (
            <>
              <FaPlus />
              疑問点を追加
            </>
          )}
        </Flex>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>疑問点</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack gap={5}>
              <FormControl>
                <FormLabel>疑問点のタイトル</FormLabel>
                <Input
                  defaultValue={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <FormHelperText>
                  疑問点は簡潔に最後が?で終わるように入力してください。
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>説明</FormLabel>
                <Textarea
                  defaultValue={answer}
                  onChange={(e) => setAnswer(e.currentTarget.value)}
                  rows={5}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              onClick={async () => {
                if (!title || !answer)
                  throw new Error('Unexpected error has ocurred.')
                if (question) {
                  await updateDoc(question.ref, {
                    title,
                    answer,
                    card_id: baseCardId,
                  })
                } else {
                  await addDoc(questionsRef, {
                    title,
                    answer,
                    card_id: baseCardId,
                  })
                }
                onClose()
              }}
              isDisabled={!title || !answer}
            >
              {question ? '更新' : '追加'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

type ItemProps = {
  question: Question
  baseCardId?: string
}

const QuestionItem = ({ question, baseCardId }: ItemProps) => {
  return (
    <Box>
      <Heading size="sm" mb={2}>
        {question.title}
      </Heading>
      <Box>{question.answer}</Box>
      <Flex mt={2} gap={3}>
        <QuestionWriter question={question} baseCardId={baseCardId} />
        <Button
          colorScheme="red"
          size="xs"
          gap={1}
          onClick={() => {
            deleteDoc(question.ref)
          }}
        >
          <FaTrash />
          疑問を削除
        </Button>
      </Flex>
    </Box>
  )
}

type Props = {
  questions: Question[]
  baseCardId?: string
}

export const QuestionList = ({ questions, baseCardId }: Props) => {
  const { isAdmin } = useAuthState()
  if (questions.length === 0 && !isAdmin) return <></>
  return (
    <Box>
      <Heading size="md" mb={2}>
        よくある疑問点
      </Heading>
      <Stack gap={8}>
        {questions.map((question) => (
          <QuestionItem question={question} baseCardId={baseCardId} />
        ))}
        {questions.length === 0 && <Box>疑問点は登録されていません。</Box>}
      </Stack>
      <QuestionWriter baseCardId={baseCardId} mt={7} />
    </Box>
  )
}
