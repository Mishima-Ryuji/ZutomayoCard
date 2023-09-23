import { Box, BoxProps, Skeleton, SlideFade, Text, VStack } from "@chakra-ui/react"
import { Timestamp } from "firebase/firestore"
import Image from "next/image"
import { FC } from "react"
import { ChampionshipColor } from "~/shared/firebase/firestore/scheme/championship"
import { DateView } from "../DateView"
import { getGradient } from "./gradient"

type ChampionshipEyecatchProps = BoxProps & {
  isLoading: boolean
  color: ChampionshipColor
  hostName: string
  name: string
  holdAt: Timestamp
  image: string | null
}
export const ChampionshipEyecatch: FC<ChampionshipEyecatchProps> = ({ isLoading, color, hostName, name: rawName, holdAt, image, ...boxProps }) => {
  const name = rawName.length >= 20 ? rawName.substring(0, 20) + "..." : rawName
  return (
    <Skeleton isLoaded={!isLoading}>
      <SlideFade
        in={!isLoading}
        transition={{ enter: { delay: 0.3, duration: 1.2 } }}
        offsetY={24}
      >

        <Box
          color="white"
          w="full"
          rounded="2xl"
          shadow="lg"
          transition="all 0.3s"
          _hover={{ shadow: "none" }}
          overflow="hidden"
          position="relative"
          bgGradient={getGradient(color)}
          textAlign="center"
          {...boxProps}
        >
          {image !== null
            ? <Image
              src={image}
              alt={rawName}
              width={800}
              height={800}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
            : <>
              <Box
                w="full"
                h={["85%", "90%"]}
                position="absolute"
                inset="0"
                margin="auto"
                bg="whiteAlpha.400"
                transform={["", "rotate(-50deg) scale(2,1.5)"]}
                shadow="sm"
              />
              <VStack
                justifyContent="center"
                alignItems="center"
                spacing={["8", "10", "20"]}
                p="6"
                position="relative"
              >
                <Text fontSize={["md", "lg"]}>
                  hosted by <br />
                  {hostName}
                </Text>
                <Text fontSize={["2xl", "3xl", "4xl"]} fontWeight="bold">
                  {name}
                </Text>
                <Box
                  border="solid 3px"
                  borderColor="white"
                  px="4"
                  py="0.5"
                  bg="whiteAlpha.300"
                  rounded="full"
                  fontSize={["md", "lg"]}
                >
                  <DateView date={holdAt.toDate()} type="date" />
                  {" "}
                  開催
                </Box>
              </VStack>
            </>}


        </Box>

      </SlideFade>
    </Skeleton>
  )
}
