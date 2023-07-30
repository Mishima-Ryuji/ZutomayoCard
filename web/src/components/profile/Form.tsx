import {
  Box,
  Button,
  Link as ChakraLink,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { CardList } from '~/components/card/List'
import { CardsSelector } from '~/components/card/Selector'
import { Card, Profile, createDoc, profileRef, updateDoc } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'

type Props = {
  cards: Card[]
  profile?: Profile
}

export const DECK_FORM_BOTTOM_SPACE = [70, 100]

export const ProfileForm = ({ cards, profile }: Props) => {
  const { user } = useAuthState()
  const [receivedCardIds, setReceivedCardIds] = useState<string[]>(
    profile?.received_card_ids ?? []
  )
  const receivedCards = useMemo(() => {
    return cards
      ?.filter((card) => receivedCardIds.includes(card.id))
      .sort(
        (a, b) =>
          receivedCardIds.findIndex((id) => a.id === id) -
          receivedCardIds.findIndex((id) => b.id === id)
      )
  }, [cards, receivedCardIds])
  const [offeredCardIds, setOfferedCardIds] = useState<string[]>(
    profile?.offered_card_ids ?? []
  )
  const offeredCards = useMemo(() => {
    return cards
      ?.filter((card) => offeredCardIds.includes(card.id))
      .sort(
        (a, b) =>
          offeredCardIds.findIndex((id) => a.id === id) -
          offeredCardIds.findIndex((id) => b.id === id)
      )
  }, [cards, offeredCardIds])
  const [showReceivedCardSelector, setShowReceivedCardSelector] =
    useState(false)
  const [showOfferedCardSelector, setShowOfferedCardSelector] = useState(false)
  const [name, setName] = useState(profile?.name ?? user?.displayName ?? '')
  const [requirement, setRequirement] = useState(profile?.requirement ?? '')
  const [contact, setContact] = useState(profile?.contact ?? '')
  const router = useRouter()

  const handleSubmit = async () => {
    if (name === '' || contact === '' || requirement === '' || !user) return
    if (profile) {
      await updateDoc(profileRef(user.uid), {
        name,
        contact,
        requirement,
        received_card_ids: receivedCardIds,
        offered_card_ids: offeredCardIds,
      })
    } else {
      await createDoc(profileRef(user.uid), {
        name,
        contact,
        requirement,
        received_card_ids: receivedCardIds,
        offered_card_ids: offeredCardIds,
      })
    }
    await router.push(`/profiles/${user.uid}`)
  }

  return (
    <>
      <Heading my={3} fontSize={'2xl'}>
        プロフィールを作成
      </Heading>
      <Box mb={5}>
        プロフィールを作成すると、あなたが交換したいカードの登録や検索、自分で作ったデッキの一覧を公開することができます。以下の項目を入力してください。
      </Box>
      <>
        {showReceivedCardSelector ? (
          <>
            <Heading mt={3} mb={2} fontSize={'1xl'}>
              あなたが欲しいカードを選択してください。
            </Heading>
            <CardsSelector
              cards={cards}
              selectedCardIds={receivedCardIds}
              setSelectedCardIds={setReceivedCardIds}
              bottomSpace={DECK_FORM_BOTTOM_SPACE}
              onClickNext={() => setShowReceivedCardSelector(false)}
              maxNumOfEachCard={1}
            />
          </>
        ) : showOfferedCardSelector ? (
          <>
            <Heading mt={3} mb={2} fontSize={'1xl'}>
              あなたが渡せるカードを選択してください。
            </Heading>
            <CardsSelector
              cards={cards}
              selectedCardIds={offeredCardIds}
              setSelectedCardIds={setOfferedCardIds}
              bottomSpace={DECK_FORM_BOTTOM_SPACE}
              onClickNext={() => setShowOfferedCardSelector(false)}
              maxNumOfEachCard={1}
            />
          </>
        ) : (
          <>
            <Stack gap={7} mb={5}>
              <FormControl>
                <FormLabel>あなたの名前（ハンドルネーム可・必須）</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>連絡先（必須）</FormLabel>
                <Textarea
                  value={contact}
                  onChange={(e) => setContact(e.currentTarget.value)}
                />
                <FormHelperText>
                  カードを交換したい相手がこの連絡先を使ってあなたに連絡します。公開しても問題ない連絡先を書いてください。
                </FormHelperText>
              </FormControl>

              <Box>
                <Heading fontSize={'xl'} mb={3}>
                  トレードの設定（任意）
                </Heading>
                <Stack gap={7}>
                  <Box>
                    <FormLabel>あなたが欲しいカード</FormLabel>
                    <CardList
                      columns={[4, 5, 6]}
                      cards={receivedCards}
                      selectedCardIds={receivedCardIds}
                    />
                    <Button
                      size={'sm'}
                      mt={1}
                      onClick={() => setShowReceivedCardSelector(true)}
                      colorScheme={'purple'}
                    >
                      カードを選択
                    </Button>
                  </Box>
                  <Box>
                    <FormLabel>あなたが渡せるカード</FormLabel>
                    <CardList
                      columns={[4, 5, 6]}
                      cards={offeredCards}
                      selectedCardIds={offeredCardIds}
                    />
                    <Button
                      size={'sm'}
                      mt={1}
                      onClick={() => setShowOfferedCardSelector(true)}
                      colorScheme={'purple'}
                    >
                      カードを選択
                    </Button>
                  </Box>
                  <FormControl>
                    <FormLabel>交換の条件</FormLabel>
                    <Textarea
                      value={requirement}
                      onChange={(e) => setRequirement(e.currentTarget.value)}
                    />
                    <FormHelperText>
                      カードを交換する際の条件を入力してください。「郵送NG」、「同リアリティの交換のみ」、「東京都のみ」、「〇〇会場手渡しのみ」など。
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </Box>
              <Box>
                <Heading fontSize={'xl'} mb={3}>
                  デッキの作成と公開（任意）
                </Heading>
                <Text>
                  プロフィールを登録後に
                  <Link href={'/decks/new'}>
                    <ChakraLink color="purple.500">
                      デッキの作成ページ
                    </ChakraLink>
                  </Link>
                  からデッキを作成することで、あなたのプロフィールにデッキが表示されます。
                </Text>
              </Box>
              <Box>
                <Button
                  colorScheme="purple"
                  isDisabled={name === '' || contact === ''}
                  onClick={handleSubmit}
                >
                  登録
                </Button>
              </Box>
            </Stack>
          </>
        )}
      </>
    </>
  )
}
