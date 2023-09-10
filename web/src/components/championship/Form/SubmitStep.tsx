import { FC, ReactNode } from "react"

import { Alert, AlertIcon, Button, VStack } from "@chakra-ui/react"

interface SubmitStepContentProps {
  onSubmit: () => void
  label: ReactNode
}
export const SubmitStepContent: FC<SubmitStepContentProps> = ({
  onSubmit,
  label,
}) => {
  return (
    <VStack spacing="4">
      <Alert status="info">
        <AlertIcon />
        準備ができました！
        大会を登録できます
      </Alert>

      <Button size="lg" onClick={onSubmit} colorScheme="purple" id="success-add-championship">
        {label}
      </Button>
    </VStack>
  )
}
