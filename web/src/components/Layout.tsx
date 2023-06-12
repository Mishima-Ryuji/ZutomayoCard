'use client'

import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Flex,
  ListItem,
  Spacer,
  Stack,
  UnorderedList,
  chakra,
} from '@chakra-ui/react'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
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
      <Stack gap={0}>
        <chakra.header
          bgColor={'purple.500'}
          position="fixed"
          width={'100%'}
          zIndex={1000}
          shadow={'sm'}
        >
          <Flex maxWidth={maxWidth} margin={'auto'} p={3} align={'center'}>
            <Link href="/">
              <Box color={'white'} fontWeight={'bold'} fontSize={'2xl'}>
                Zutomayo Card Wiki
              </Box>
            </Link>
            <Spacer />
          </Flex>
        </chakra.header>
        <Box width={'100%'} height={'60px'} />
        {eyecatchImage && (
          <Box width={'100%'} height={500} backgroundColor={'blackAlpha.500'}>
            画像入れる
          </Box>
        )}
        <Container maxWidth={maxWidth} width={'100%'} px={3}>
          {children}
        </Container>
        <chakra.footer p={3} bgColor={'gray.100'}>
          <Container maxWidth={maxWidth} px={3}>
            <UnorderedList>
              <ListItem fontSize={'x-small'}>
                本サービスは非公式のサービスであり、「ずっと真夜中でいいのに。」の公認のサービスではありません。
              </ListItem>
              <ListItem fontSize={'x-small'}>
                本サービスの運営は、完全に非営利でファンコミュニティとして運営しています。
              </ListItem>
              <ListItem fontSize={'x-small'}>
                本サービスに掲載されているカードの画像は、カードの実物を直接撮影したものを掲載しています。カードを直接撮影した上での掲載は、公式に問い合わせて問題ないことを確認しております。
              </ListItem>
              <ListItem fontSize={'x-small'}>
                本サービスに掲載されているカードの画像以外のイラストや画像は運営で制作した二次創作です。
              </ListItem>
              <ListItem fontSize={'x-small'}>
                本サービスは公式から警告や中止の要請があった場合は速やかにその要求に応じます。
              </ListItem>
              <ListItem fontSize={'x-small'}>
                本サービスの掲載内容は、不明点を公式のスタッフに尋ねることでなるべく正しい情報を掲載するように心掛けていますが、完全に正しさが保証されたものではありません。
              </ListItem>
            </UnorderedList>
            {!loading && (
              <Button
                size={'sm'}
                onClick={async () => {
                  if (user) {
                    signOut(fb.auth)
                  } else {
                    const provider = new GoogleAuthProvider()
                    await signInWithPopup(fb.auth, provider)
                  }
                }}
                colorScheme="purple"
                mt={8}
                mb={3}
              >
                {user ? '管理者をログアウト' : '管理者としてログイン'}
              </Button>
            )}
          </Container>
        </chakra.footer>
      </Stack>
    </ChakraProvider>
  )
}
