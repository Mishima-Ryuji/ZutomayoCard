import { Box } from "@chakra-ui/react"
import { FC } from "react"
import { useRandomUniguriBalloon } from "~/hooks/uniguri-balloon/useRandomUniguriBalloon"
import { UniguriBalloonView } from "../../UniguriBalloonView"

export const FixedUniguriBalloonView: FC = () => {
  const randomUniguriBalloon = useRandomUniguriBalloon()
  return (
    <Box
      position="fixed"
      right="0"
      bottom="0"
      zIndex="popover"
    >
      {randomUniguriBalloon.data &&
        <UniguriBalloonView
          message={randomUniguriBalloon.data.message}
          imageUrl={randomUniguriBalloon.data.image_url}
        />
      }
    </Box>
  )
}
