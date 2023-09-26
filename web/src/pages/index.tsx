import {
  Box,
  Button,
  CardBody,
  CardHeader,
  Card as ChakraCard,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Tab,
  TabList,
  Tabs
} from '@chakra-ui/react'
import { getDocs } from 'firebase/firestore'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { FaTwitter } from 'react-icons/fa'
import { DefaultLayout } from '~/components/Layout'
import { LoginPopup } from '~/components/auth/LoginPopup'
import { CardList } from '~/components/card/List'
import { TopMenuItem, TopMenuItemLinkHeading } from '~/components/top/MenuItem'
import { FixedUniguriBalloonView } from '~/components/uniguri_balloon/page/top/FixedUniguriBalloonView'
import { Card, cardConverter, cardsRef } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { Serialized, deserializeArray, serializeArray } from '~/shared/utils'

type Props = {
  cards: Serialized<Card>[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const cardsSnapshot = await getDocs(cardsRef)
  const cards = cardsSnapshot.docs.map((doc) => doc.data())
  const result = {
    props: {
      cards: serializeArray(cards),
    },
    revalidate: 60 * 10,
  }
  return result
}

const Page = ({ cards: staticCards }: Props) => {
  const [category, setCategory] = useState<Card['category']>('1st')
  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })
  const formattedCards = useMemo(() => {
    return cards
      ?.filter((card) => card.category === category)
      .sort((a, b) => a.order - b.order)
  }, [cards, category])
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const { user } = useAuthState()
  return (
    <DefaultLayout head={{}} eyecatchImage>
      <LoginPopup
        show={showLoginPopup}
        onHide={() => setShowLoginPopup(false)}
      />
      <ChakraCard mt={5}>
        <CardHeader bgColor={'purple.500'} py={3}>
          <Box
            position={'relative'}
            width={[935 * 0.15, 935 * 0.2]}
            height={[179 * 0.15, 179 * 0.2]}
          >
            <Image src="/brand.png" fill alt="Zutomayo Card Wiki" />
          </Box>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="3">
            <TopMenuItem
              imageSrc='/elements/darkness.png'
              heading={
                <TopMenuItemLinkHeading href="/search">
                  カードの検索と詳しい情報
                </TopMenuItemLinkHeading>
              }
            >
              効果やカード名でレアリティで検索したり、対戦での使い方を動画付きで解説しています。
            </TopMenuItem>
            <TopMenuItem
              imageSrc='/elements/electricity.png'
              heading={
                <TopMenuItemLinkHeading href="/decks">
                  デッキ検索と構築
                </TopMenuItemLinkHeading>
              }
            >
              対戦ガチ勢のデッキを検索したり、自分のオリジナルのデッキを作って共有できます。
            </TopMenuItem>
            <TopMenuItem
              imageSrc='/elements/flame.png'
              heading={user ? (
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  color={'purple.600'}
                >
                  <Link href={'/profiles/edit'}>トレード相手の検索</Link>
                </Heading>
              ) : (
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  color={'purple.600'}
                  cursor={'pointer'}
                  onClick={() => setShowLoginPopup(true)}
                >
                  トレード相手の検索
                </Heading>
              )}
            >
              本サイトに自分が欲しいカードと譲れるカードを登録することで交換相手を見つけやすくなります。
            </TopMenuItem>
            <TopMenuItem
              imageSrc='/elements/wind.png'
              heading={
                <TopMenuItemLinkHeading href="/about">
                  運営の情報
                </TopMenuItemLinkHeading>
              }
            >
              当サイトの運営の情報を掲載しています。当サイトに協力してくださる方も募集しております。
            </TopMenuItem>
            <Flex gap={3} align={'center'}>
              {user === null && (
                <Button
                  colorScheme="purple"
                  size={'sm'}
                  onClick={() => setShowLoginPopup(true)}
                >
                  ログイン
                </Button>
              )}
              <Link href="https://twitter.com/ztmycard_wiki">
                <Button
                  colorScheme="twitter"
                  size={'sm'}
                  leftIcon={<FaTwitter />}
                >
                  運営のTwitter
                </Button>
              </Link>
            </Flex>
          </Stack>
        </CardBody>
      </ChakraCard>
      <Flex py={3}>
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList overflowY={'auto'}>
            <Tab flexShrink={0} onClick={() => setCategory('1st')}>
              第一弾
            </Tab>
            <Tab flexShrink={0} onClick={() => setCategory('2nd')}>
              第二弾
            </Tab>
            <Tab
              flexShrink={0}
              onClick={() => setCategory('local/techno_poor')}
            >
              ご当地
            </Tab>
            <Tab flexShrink={0} onClick={() => setCategory('bonus/jinkougaku')}>
              特典
            </Tab>
            <Tab flexShrink={0} onClick={() => setCategory('collab/OIOI')}>
              コラボ
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
      {formattedCards && <CardList cards={formattedCards} />}
      <FixedUniguriBalloonView />
    </DefaultLayout>
  )
}

export default Page
