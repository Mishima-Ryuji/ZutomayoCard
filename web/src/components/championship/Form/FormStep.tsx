import { Box, Step, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle } from "@chakra-ui/react"
import { FC, ReactNode } from "react"

interface FormStepProps {
  title: ReactNode
}
export const FormStep: FC<FormStepProps> = ({ title }) => {
  return (
    <Step as={Box} minW="fit-content">
      <StepIndicator>
        <StepStatus
          complete={<StepIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>

      <Box flexShrink='0' minW="fit-content">
        <StepTitle>{title}</StepTitle>
      </Box>

      <StepSeparator as={Box} transitionProperty="all" transitionDuration="0.3s" />
    </Step>
  )
}
