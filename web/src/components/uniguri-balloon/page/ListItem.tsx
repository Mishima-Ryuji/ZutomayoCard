import { Badge, Box, Divider, Flex, HStack, IconButton } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import { FaEdit } from "react-icons/fa"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"
import { DateText } from "./DateText"

interface UniguriBalloonListItemProps {
  uniguriBalloon: UniguriBalloon
}
export const UniguriBalloonListItem: FC<UniguriBalloonListItemProps> = ({ uniguriBalloon }) => {
  const now = new Date().valueOf()
  const inLimit = uniguriBalloon.start_at.toMillis() <= now && now <= uniguriBalloon.end_at.toMillis()

  return (
    <Flex direction="column">
      <Flex p={2} alignItems="flex-start">

        <Box px={1} py={4}>
          <Image
            src={uniguriBalloon.image_url}
            alt={uniguriBalloon.message}
            width={48}
            height={48}
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Box flexGrow="1">

          <HStack fontWeight="bold" justifyContent="flex-end" flexWrap="wrap">
            <Box flexGrow="1">
              {uniguriBalloon.message}
            </Box>
            <Box>
              <Link href={`/admin/uniguri-balloon/${uniguriBalloon.id}/edit`}>
                <IconButton
                  size={{ base: "xs", sm: "sm" }}
                  aria-label='x'
                  icon={<><FaEdit /></>}
                />
              </Link>
            </Box>
          </HStack>

          <HStack my={2} spacing={1}>
            {uniguriBalloon.enable
              ? inLimit
                ? <Badge colorScheme="blue" variant="outline">
                  公開中
                </Badge>
                : <Badge colorScheme="gray">
                  公開期間外
                </Badge>
              : <Badge colorScheme="gray">
                非公開
              </Badge>
            }
            <span>
              <DateText date={uniguriBalloon.created_at.toDate()} />
              {" "}
              作成
            </span>
          </HStack>

        </Box>

      </Flex>
      <Divider />
    </Flex>
  )
}
