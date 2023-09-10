import { Button, ButtonProps, HStack, StackProps } from "@chakra-ui/react"
import { FC } from "react"

export interface NavigationProps extends StackProps {
  prev: ButtonProps
  next: ButtonProps
}
export const Navigation: FC<NavigationProps> = ({ prev, next, ...stackProps }) => {
  return (
    <HStack justifyContent="space-around" {...stackProps}>
      <Button colorScheme="gray" {...prev}>
        戻る
      </Button>
      <Button colorScheme="purple" {...next}>
        次へ
      </Button>
    </HStack>
  )
}
