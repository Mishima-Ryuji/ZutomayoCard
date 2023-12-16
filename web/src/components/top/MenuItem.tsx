import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react"
import Image from "next/image"
import { FC, ReactNode } from "react"

interface TopMenuItemProps {
  imageSrc: string
  heading: ReactNode
  children: ReactNode
}
export const TopMenuItem: FC<TopMenuItemProps> = ({
  imageSrc, heading, children
}) => {
  return (
    <Box>
      <Flex align={'center'}>
        <Image
          src={imageSrc}
          alt="項目の印"
          width={25}
          height={25}
        />
        {heading}
      </Flex>
      <Text pt="2" fontSize="sm">
        {children}
      </Text>
    </Box>
  )
}

interface TopMenuItemLinkHeadingProps {
  href: string
  children?: ReactNode
}
export const TopMenuItemLinkHeading: FC<TopMenuItemLinkHeadingProps> = ({
  href, children,
}) => {
  return (
    <Heading
      size="xs"
      textTransform="uppercase"
      color={'purple.600'}
    >
      <Link href={href}>{children}</Link>
    </Heading>
  )
}
