'use client'

import {
  AspectRatio,
  Box,
  Container,
  Flex,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Spacer,
  Stack,
  UnorderedList,
  chakra,
  useToast,
} from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { fb } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { Head, HeadProps } from './Head'
import { InvitationBanners } from './InvitationBanners'
import { LoginPopup } from './auth/LoginPopup'

type Props = {
  head: HeadProps
  eyecatchImage?: boolean
  maxWidth?: number
  children?: React.ReactNode
  bottomSpace?: number | number[]
  footerNone?: boolean
  noBanner?: boolean
}

export const DefaultLayout = ({
  head,
  children,
  maxWidth = 1200,
  eyecatchImage = false,
  bottomSpace = 0,
  footerNone = false,
  noBanner = false,
}: Props) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const { user, isAdmin } = useAuthState()
  const toast = useToast()

  return (
    <>
      <Head {...head} />
      <LoginPopup
        show={showLoginPopup}
        onHide={() => setShowLoginPopup(false)}
      />
      <Stack gap={0}>
        <chakra.header
          bgColor={'purple.500'}
          position="fixed"
          width={'100%'}
          zIndex={1000}
          shadow={'md'}
        >
          <Flex
            maxWidth={maxWidth}
            margin={'auto'}
            p={2}
            px={3}
            gap={[3, 3, 5]}
            fontSize={['xl', 'xl', '2xl']}
            align={'center'}
          >
            <Link href="/">
              <Box
                position={'relative'}
                width={[935 * 0.15, 935 * 0.2]}
                height={[179 * 0.15, 179 * 0.2]}
              >
                <Image src="/brand.png" fill alt="Zutomayo Card Wiki" />
              </Box>
            </Link>
            <Spacer />
            <Link href="/decks">
              <Image
                src="/icons/deck_builder.png"
                alt="デッキビルダーアイコン"
                width={25}
                height={25}
              />
            </Link>
            <Link href="/search">
              <Image
                src="/icons/search.png"
                alt="検索アイコン"
                width={(25 / 680) * 830}
                height={25}
              />
            </Link>
            <Menu placement="bottom-end">
              <MenuButton>
                <FaUser color="#e5dad7" />
              </MenuButton>
              <Portal>
                <MenuList mt={1}>
                  {user ? (
                    <>
                      <Link href={`/profiles/${user.uid}`}>
                        <MenuItem>プロフィール</MenuItem>
                      </Link>
                      <MenuItem
                        onClick={async () => {
                          await signOut(fb.auth)
                          toast({
                            title: 'Zutomayo Card Wiki',
                            description: 'ログアウトしました。',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                          })
                        }}
                      >
                        ログアウト
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={() => setShowLoginPopup(true)}>
                        ログイン
                      </MenuItem>
                    </>
                  )}
                  <MenuDivider />
                  {isAdmin &&
                    <>
                      <MenuGroup title="管理者ページ">
                        <Link href="/admin/uniguri-balloon">
                          <MenuItem>
                            うにぐりの一言
                          </MenuItem>
                        </Link>
                        <MenuDivider />
                      </MenuGroup>
                    </>
                  }
                  <Link href={`/about`}>
                    <MenuItem>運営について</MenuItem>
                  </Link>
                  <Link href={`/caution`}>
                    <MenuItem>利用上の注意点</MenuItem>
                  </Link>
                </MenuList>
              </Portal>
            </Menu>
          </Flex>
        </chakra.header>
        {/* TODO: ヘッダーの高さ分をとる、要ハードコーディング改善 */}
        <Box height={[42.82, 51.8]} />
        <Box>
          {eyecatchImage && (
            <Box m="auto" width={'100%'} backgroundColor={'#442c6c'}>
              <AspectRatio maxWidth={maxWidth} m="auto" ratio={1280 / 460}>
                <Image
                  src="/first_view.png"
                  alt="ずとまよカードWikiのトップ画像"
                  fill
                />
              </AspectRatio>
            </Box>
          )}
        </Box>
        <Container maxWidth={maxWidth} width={'100%'} px={3}>
          {children}
          {noBanner === false && (
            <Box width={'100%'} my={7}>
              <InvitationBanners />
            </Box>
          )}
        </Container>
        <Box height={bottomSpace} width={'100%'} />
        {!footerNone && (
          <chakra.footer py={3} bgColor={'gray.100'}>
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
                  本サービス上の画像や情報を無断で利用することは禁止です。
                </ListItem>
                <ListItem fontSize={'x-small'}>
                  本サービスは公式から警告や中止の要請があった場合は速やかにその要求に応じます。
                </ListItem>
                <ListItem fontSize={'x-small'}>
                  本サービスの掲載内容は、不明点を公式のスタッフに尋ねることでなるべく正しい情報を掲載するように心掛けていますが、完全に正しさが保証されたものではありません。
                </ListItem>
              </UnorderedList>
            </Container>
          </chakra.footer>
        )}
      </Stack>
    </>
  )
}
