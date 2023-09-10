import { Box } from "@chakra-ui/react"
import { FC, ReactNode } from "react"

interface ToggleProps {
  show: boolean
  children?: ReactNode
}
export const Toggle: FC<ToggleProps> = ({ show, children }) => {
  return (
    <Box display={show ? "block" : "none"}>
      {children}
    </Box>
  )
}
