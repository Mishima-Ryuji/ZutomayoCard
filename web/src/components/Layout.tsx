'use client'

import { Box, ChakraProvider, Flex, chakra } from '@chakra-ui/react'
import Link from 'next/link'

type Props = {
  eyecatchImage?: boolean
  maxWidth?: number
  children?: React.ReactNode
}

export const DefaultLayout = ({
  children,
  maxWidth = 1200,
  eyecatchImage = false,
}: Props) => {
  return (
    <ChakraProvider>
      <chakra.header py={4} bgColor={'purple.500'}>
        <Flex maxWidth={maxWidth} margin={'auto'} px={3}>
          <Link href="/">
            <Box color={'white'} fontWeight={'bold'}>
              Zutomayo Card Wiki
            </Box>
          </Link>
        </Flex>
      </chakra.header>
      {eyecatchImage && (
        <Box width={'100%'} height={500} backgroundColor={'blackAlpha.500'}>
          画像入れる
        </Box>
      )}
      <Box maxWidth={maxWidth} px={3} margin={'auto'}>
        {children}
      </Box>
    </ChakraProvider>
  )
}
