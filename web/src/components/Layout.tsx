'use client'

import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Spacer,
  chakra,
} from '@chakra-ui/react'
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { fb } from '~/firebase'

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
  const [user, loading] = useAuthState(fb.auth)
  return (
    <ChakraProvider>
      <chakra.header py={3} bgColor={'purple.500'}>
        <Flex maxWidth={maxWidth} margin={'auto'} px={3} align={'center'}>
          <Link href="/">
            <Box color={'white'} fontWeight={'bold'} fontSize={'2xl'}>
              Zutomayo Card Wiki
            </Box>
          </Link>
          <Spacer />
          {!loading && (
            <Button
              size={'sm'}
              onClick={async () => {
                if (user) {
                  signOut(fb.auth)
                } else {
                  const provider = new GoogleAuthProvider()
                  await signInWithRedirect(fb.auth, provider)
                }
              }}
            >
              {user ? 'ログアウト' : 'ログイン'}
            </Button>
          )}
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
