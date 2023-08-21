import { Badge, Box, Flex, FormControl, FormHelperText, FormLabel } from "@chakra-ui/react"
import { FC, ReactNode } from "react"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"
import { UniguriBalloonView } from "../UniguriBalloonView"

interface UniguriBalloonPreviewProps {
  message: UniguriBalloon["message"]
  imageUrl: UniguriBalloon["image_url"]
  button: UniguriBalloon["button"]
  label?: ReactNode
}
export const UniguriBalloonPreview: FC<UniguriBalloonPreviewProps> = ({ message, imageUrl, button, label = "プレビュー" }) => {
  return (
    imageUrl !== null
      ? <FormControl my={8}>
        <FormLabel>
          {label}
        </FormLabel>
        <FormHelperText>
          表示が崩れていないか確認してください。
          トップページの右下に表示されます。
        </FormHelperText>
        <Flex flexDir="column">
          <Box minH="full" >
            <Badge>スマホ</Badge>
            <Flex
              bgColor="gray.100"
              p={6}
              w="fit-content"
              maxW="full"
              overflow="auto"
            >
              <UniguriBalloonView
                mode="sp"
                message={message}
                imageUrl={imageUrl}
                button={button}
              />
            </Flex>
          </Box>
          <Box minH="full">
            <Badge>PC</Badge>
            <Flex
              bgColor="gray.100"
              w="fit-content"
              maxW="full"
              p={6}
              overflowX="auto"
            >
              <UniguriBalloonView
                mode="pc"
                message={message}
                imageUrl={imageUrl}
                button={button}
              />
            </Flex>
          </Box>
        </Flex>
      </FormControl>
      : <></>
  )
}
