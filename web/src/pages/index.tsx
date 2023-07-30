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
  Tabs,
  Text,
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
            <Box>
              <Flex align={'center'}>
                <Image
                  src="/elements/darkness.png"
                  alt="項目の印"
                  width={25}
                  height={25}
                />
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  color={'purple.600'}
                >
                  <Link href={'/search'}>カードの検索と詳しい情報</Link>
                </Heading>
              </Flex>
              <Text pt="2" fontSize="sm">
                効果やカード名でレアリティで検索したり、対戦での使い方を動画付きで解説しています。
              </Text>
            </Box>
            <Box>
              <Flex align={'center'}>
                <Image
                  src="/elements/electricity.png"
                  alt="項目の印"
                  width={25}
                  height={25}
                />
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  color={'purple.600'}
                >
                  <Link href={'/decks'}>デッキ検索と構築</Link>
                </Heading>
              </Flex>
              <Text pt="2" fontSize="sm">
                対戦ガチ勢のデッキを検索したり、自分のオリジナルのデッキを作って共有できます。
              </Text>
            </Box>
            <Box>
              <Flex align={'center'}>
                <Image
                  src="/elements/flame.png"
                  alt="項目の印"
                  width={25}
                  height={25}
                />
                {user ? (
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
              </Flex>
              <Text pt="2" fontSize="sm">
                本サイトに自分が欲しいカードと譲れるカードを登録することで交換相手を見つけやすくなります。
              </Text>
            </Box>
            <Box>
              <Flex align={'center'}>
                <Image
                  src="/elements/wind.png"
                  alt="項目の印"
                  width={25}
                  height={25}
                />
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  color={'purple.600'}
                  cursor={'pointer'}
                >
                  <Link href={'/about'}>運営の情報</Link>
                </Heading>
              </Flex>
              <Text pt="2" fontSize="sm">
                当サイトの運営の情報を掲載しています。当サイトに協力してくださる方も募集しております。
              </Text>
            </Box>
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
              <Link href="https://twitter.com/zutoca_wiki">
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
    </DefaultLayout>
  )
}

export default Page
