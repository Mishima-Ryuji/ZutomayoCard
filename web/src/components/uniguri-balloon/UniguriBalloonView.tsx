import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Center, Fade, Flex, VStack, useBreakpoint, useDisclosure } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import BalloonImg from "~/../public/uniguri_balloon/balloon.png"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

interface UniguriBalloonViewProps {
  mode?: "sp" | "pc"
  message: UniguriBalloon["message"]
  imageUrl: UniguriBalloon["image_url"]
  button: UniguriBalloon["button"]
}
export const UniguriBalloonView: FC<UniguriBalloonViewProps> = ({ mode: propsMode, ...props }) => {
  const defaultMode = useBreakpoint() === "base" ? "sp" : "pc"
  const mode = propsMode ?? defaultMode

  return mode === "sp"
    ? <SpUniguriBalloon {...props} />
    : <PcUniguriBalloon {...props} />
}

interface SpUniguriBalloonProps {
  message: UniguriBalloon["message"]
  imageUrl: UniguriBalloon["image_url"]
}
const SpUniguriBalloon: FC<SpUniguriBalloonProps> = ({ message, imageUrl }) => {
  const dialog = useDisclosure()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [showClose, setShowClose] = useState(false)
  useEffect(() => {
    setShowClose(dialog.isOpen)
  }, [dialog.isOpen])

  const [uniguriImageLoaded, setUniguriImageLoaded] = useState(false)

  return (
    <>
      <Fade in={uniguriImageLoaded}>
        <Box
          minWidth={100}
          minHeight={100}
          transition="all 0.3s"
          _hover={{
            transform: "scale(1.05)",
          }}
          _active={{
            transform: "translateY(-10px)",
          }}
          onClick={dialog.onOpen}
        >
          <Image
            src={imageUrl}
            alt="うにぐりくん"
            width={100}
            height={100}
            style={{ height: "auto", userSelect: "none" }}
            onLoadingComplete={() => setUniguriImageLoaded(true)}
          />
        </Box>
      </Fade>
      <AlertDialog isOpen={dialog.isOpen} onClose={dialog.onClose} leastDestructiveRef={closeButtonRef}>
        <AlertDialogOverlay>
          <AlertDialogContent mx={2}>
            <AlertDialogHeader>
              <AlertDialogCloseButton />
            </AlertDialogHeader>
            <AlertDialogBody>
              <VStack>
                <Box textAlign="center">
                  <Text>
                    {message}
                  </Text>
                </Box>
                <Image
                  src={imageUrl}
                  alt="うにぐりくん"
                  width={100}
                  height={100}
                  style={{ height: "auto", userSelect: "none" }}
                />
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Center w="full">
                <Fade in={showClose} delay={0.75}>
                  <Button size="sm" variant="ghost" ref={closeButtonRef} onClick={dialog.onClose}>
                    とじる
                  </Button>
                </Fade>
              </Center>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
interface PcUniguriBalloonProps {
  message: UniguriBalloon["message"]
  imageUrl: UniguriBalloon["image_url"]
  button: UniguriBalloon["button"]
}
const PcUniguriBalloon: FC<PcUniguriBalloonProps> = ({ message, imageUrl, button }) => {
  const [uniguriImageLoaded, setUniguriImageLoaded] = useState(false)
  const [balloonImageLoaded, setBalloonImageLoaded] = useState(false)
  const imageLoaded = uniguriImageLoaded && balloonImageLoaded
  return (
    <Fade in={imageLoaded}>
      <Box
        w={350} minW={350} maxW={350}
        h={150} minH={150} maxH={150}
        display="inline-block"
        position="relative"
      >
        <Image
          src={BalloonImg}
          alt="吹き出し"
          width={300}
          height={300}
          style={{ height: "auto", position: "absolute", top: 0, left: 0, userSelect: "none" }}
          onLoadingComplete={() => setBalloonImageLoaded(true)}
        />
        <Flex
          position="absolute"
          left="27px"
          top="22px"
          width="233px"
          height="79px"
          fontSize={message.length <= 20 ? "22px" : "16px"}
          lineHeight="1.2em"
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <Text>
              {message}
            </Text>
          </Box>
        </Flex>
        {button !== null &&
          <Link href={button.href}>
            <Button
              colorScheme="purple"
              size="sm"
              position="absolute"
              left="0"
              bottom="16px"
            >
              {button.text}
            </Button>
          </Link>
        }
        <Box
          position="absolute"
          right={0}
          bottom={0}
          transition="all 0.3s"
          _hover={{
            transform: "scale(1.05)",
          }}
          _active={{
            transform: "translateY(-10px)",
          }}
        >
          <Image
            src={imageUrl}
            alt="うにぐりくん"
            width={100}
            height={100}
            style={{ height: "auto", userSelect: "none" }}
            onLoadingComplete={() => setUniguriImageLoaded(true)}
          />
        </Box>
      </Box>
    </Fade>
  )
}

interface TextProps {
  children?: string
}
const Text: FC<TextProps> = ({ children }) => {
  return (
    <>
      {children?.split("\n").map((line, i) =>
        <Fragment key={i}>
          {line}<br />
        </Fragment>
      )}
    </>
  )
}
