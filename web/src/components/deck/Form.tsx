import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { deleteField } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { CardList } from '~/components/card/List'
import { CardsSelector } from '~/components/card/Selector'
import { Card, Deck, addDoc, decksRef, updateDoc } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { isBlank } from '~/shared/utils'

type Props = {
  cards: Card[]
  deck?: Deck
}

export const DECK_FORM_BOTTOM_SPACE = [70, 100]

export const DeckForm = ({ cards, deck }: Props) => {
  const { isAdmin, user } = useAuthState()
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(
    deck?.card_ids ?? []
  )
  const selectedCards = useMemo(() => {
    return cards
      ?.filter((card) => selectedCardIds.includes(card.id))
      .sort(
        (a, b) =>
          selectedCardIds.findIndex((id) => a.id === id) -
          selectedCardIds.findIndex((id) => b.id === id)
      )
  }, [cards, selectedCardIds])
  const [showCardSelector, setShowCardSelector] = useState(deck ? false : true)
  const [name, setName] = useState(deck?.name ?? 'My deck')
  const [description, setDescription] = useState(deck?.description ?? '')
  const [youtubeURL, setYoutubeURL] = useState(
    deck?.youtube_id !== undefined
      ? `https://www.youtube.com/watch?v=${deck.youtube_id}`
      : ''
  )
  const [isPublic, setIsPublic] = useState(false)
  useEffect(() => {
    setIsPublic(isAdmin)
  }, [isAdmin])

  const router = useRouter()
  return (
    <>
      <Heading my={3} fontSize={'2xl'}>
        新しいデッキを作成
      </Heading>
      <>
        {showCardSelector ? (
          <>
            <Heading mt={3} mb={2} fontSize={'1xl'}>
              カードを20枚選択してください。
            </Heading>
            <p>
              選択した順番にデッキに追加されるので、重要なカードを先に選択することを推奨します。
            </p>
            <CardsSelector
              cards={cards}
              selectedCardIds={selectedCardIds}
              setSelectedCardIds={setSelectedCardIds}
              bottomSpace={DECK_FORM_BOTTOM_SPACE}
              onClickNext={() => setShowCardSelector(false)}
              nextButtonDisabled={selectedCardIds.length !== 20}
              counter
            />
          </>
        ) : (
          <>
            <CardList
              width={'100px'}
              gap={5}
              cards={selectedCards}
              selectedCardIds={selectedCardIds}
              counter
            />
            <Button
              mt={5}
              size={'sm'}
              onClick={() => setShowCardSelector(true)}
              colorScheme={'purple'}
            >
              カードを再選択
            </Button>
            <Heading my={5} fontSize={'1xl'}>
              デッキの情報を入力してください。
            </Heading>
            <Stack gap={5}>
              <FormControl isInvalid={name === ''}>
                <FormLabel>デッキの名前</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
                {isAdmin && (
                  <FormHelperText>
                    作戦やコンセプトが伝わる簡潔な名前を設定しましょう。
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>
                  デッキの解説や立ち回り方{isAdmin === false && '(任意)'}
                </FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />
                {isAdmin && (
                  <FormHelperText>
                    どのカードをどのタイミングで使うかなどの解説を書きましょう。
                  </FormHelperText>
                )}
              </FormControl>
              {isAdmin && (
                <FormControl
                  isInvalid={youtubeURL !== '' && !/v=(.+)$/.test(youtubeURL)}
                >
                  <FormLabel>YouTubeのURL</FormLabel>
                  <Input
                    placeholder="URLを入力してください"
                    value={youtubeURL}
                    onChange={(e) => setYoutubeURL(e.currentTarget.value)}
                  />
                </FormControl>
              )}
              {isAdmin && (
                <FormControl
                  isInvalid={youtubeURL !== '' && !/v=(.+)$/.test(youtubeURL)}
                >
                  <FormLabel>YouTubeのURL</FormLabel>
                  <Input
                    placeholder="URLを入力してください"
                    value={youtubeURL}
                    onChange={(e) => setYoutubeURL(e.currentTarget.value)}
                  />
                </FormControl>
              )}
              {isAdmin && (
                <FormControl>
                  <Checkbox
                    isChecked={isPublic}
                    onChange={(e) => setIsPublic(e.currentTarget.checked)}
                  >
                    公開する
                  </Checkbox>
                </FormControl>
              )}
              <Box>
                <Button
                  isDisabled={
                    isBlank(user) ||
                    name === '' ||
                    (isAdmin &&
                      youtubeURL !== '' &&
                      !/v=(.+)$/.test(youtubeURL))
                  }
                  colorScheme="purple"
                  onClick={async () => {
                    if (isBlank(user)) {
                      throw new Error('This action requires authentication.')
                    }
                    const youtubeIdCap = /v=(.+)$/.exec(youtubeURL)
                    if (deck) {
                      await updateDoc(deck.ref, {
                        card_ids: selectedCardIds,
                        name,
                        description:
                          description !== '' ? description : deleteField(),
                        youtube_id:
                          youtubeURL !== '' && youtubeIdCap !== null
                            ? youtubeIdCap[1]
                            : deleteField(),
                      })
                      await router.push(`/decks/${deck.id}`)
                    } else {
                      const deckRef = await addDoc(decksRef, {
                        created_by: user.uid,
                        card_ids: selectedCardIds,
                        name,
                        description:
                          description !== '' ? description : undefined,
                        youtube_id:
                          youtubeURL !== '' && youtubeIdCap !== null
                            ? youtubeIdCap[1]
                            : undefined,
                        is_public: isPublic,
                      })
                      await router.push(`/decks/${deckRef.id}`)
                    }
                  }}
                >
                  保存
                </Button>
              </Box>
            </Stack>
          </>
        )}
      </>
    </>
  )
}
