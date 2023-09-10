import { Alert, AlertIcon, Button, Collapse, Spinner, VStack } from "@chakra-ui/react"
import NextLink from "next/link"
import { FC } from "react"

interface SubmitStepContentProps {
  isSubmitting: boolean
  isSubmitted: boolean
  onSubmit: () => void
  onPrev: () => void
  nextLink: string | null
}
export const SubmitStepContent: FC<SubmitStepContentProps> = ({
  isSubmitting,
  isSubmitted,
  onSubmit,
  onPrev,
  nextLink,
}) => {
  return (
    <VStack spacing="4">
      <Alert status="info">
        <AlertIcon />
        準備ができました！
        大会を登録できます
      </Alert>

      <Button
        size="lg"
        onClick={onSubmit}
        colorScheme="purple"
        isDisabled={isSubmitting || isSubmitted}
        leftIcon={isSubmitting ? <Spinner /> : undefined}
      >
        登録する
      </Button>
      <Collapse in={isSubmitted}>
        {/* TODO championship eyecatch */}
        <Button
          size="lg"
          colorScheme="purple"
          as={NextLink}
          href={nextLink ?? "/championships"}
        >
          大会のページへ
        </Button>
      </Collapse>
      <VStack>
        <Button onClick={onPrev} isDisabled={isSubmitting || isSubmitted}>
          戻る
        </Button>
      </VStack>
    </VStack>
  )
}
