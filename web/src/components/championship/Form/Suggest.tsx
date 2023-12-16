import { Box, Button, ButtonProps, HStack, useFormControlContext } from "@chakra-ui/react"
import { FC, ReactNode } from "react"

interface SuggestProps {
  children?: ReactNode
}
export const Suggest: FC<SuggestProps> = ({ children }) => {
  return (
    <Box fontSize="sm" pt="1" pl="2">
      もしかして...?
      <HStack justifyItems="flex-start" flexWrap="wrap" w="full" spacing="1">
        {children}
      </HStack>
    </Box>
  )
}


type SuggestButtonProps = ButtonProps
export const SuggestButton: FC<SuggestButtonProps> = (props) => {
  const control = useFormControlContext()
  return (
    <Button
      size="xs"
      isDisabled={control.isDisabled}
      {...props}
    />
  )
}