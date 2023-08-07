import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack
} from '@chakra-ui/react'
import { OutputData } from '@editorjs/editorjs'
import { deleteField } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { CardList } from '~/components/card/List'
import { CardsSelector } from '~/components/card/Selector'
import { Card, Deck, addDoc, decksRef, updateDoc } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { isBlank } from '~/shared/utils'
import { useRichEditor } from '../richText/editor'
import { editorValueFromString, editorValueToString } from '../richText/editor/helper'
import PreviewRichEditor from '../richText/editor/preview/PreviewRichEditor'

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
  const [detail, setDetail] = useState(deck?.detail ?? '')
  const markupedDetail = useRichEditor({
    editorKey: "detail",
    defaultValue: deck?.markuped_detail as OutputData ?? editorValueFromString(detail),
  })
  const [concept, setConcept] = useState(deck?.concept ?? '')
  const markupedConcept = useRichEditor({
    editorKey: "concept",
    defaultValue: deck?.markuped_concept as OutputData ?? editorValueFromString(concept),
  })
  const [movement, setMovement] = useState(deck?.movement ?? '')
  const markupedMovement = useRichEditor({
    editorKey: "movement",
    defaultValue: deck?.markuped_movement as OutputData ?? editorValueFromString(movement),
  })
  const [adoption, setAdoption] = useState(deck?.cards_adoption ?? '')
  const markupedAdoption = useRichEditor({
    editorKey: "adoption",
    defaultValue: deck?.markuped_cards_adoption as OutputData ?? editorValueFromString(adoption),
  })
  const [youtubeURL, setYoutubeURL] = useState(
    deck?.youtube_id !== undefined
      ? `https://www.youtube.com/watch?v=${deck.youtube_id}`
      : ''
  )
  const [isPublic, setIsPublic] = useState(true)
  const [isRecommended, setIsRecommended] = useState(false)
  useEffect(() => {
    setIsRecommended(isAdmin)
  }, [isAdmin])

  const router = useRouter()

  const handleSave = async () => {
    if (isBlank(user)) {
      throw new Error('This action requires authentication.')
    }
    const youtubeIdCap = /v=(.+)$/.exec(youtubeURL)
    if (deck) {
      await updateDoc(deck.ref, {
        card_ids: selectedCardIds,
        name,
        concept: concept !== '' ? concept : deleteField(),
        movement: movement !== '' ? movement : deleteField(),
        cards_adoption:
          adoption !== '' ? adoption : deleteField(),
        detail: detail !== '' ? detail : deleteField(),
        youtube_id:
          youtubeURL !== '' && youtubeIdCap !== null
            ? youtubeIdCap[1]
            : deleteField(),
        markuped_concept: await markupedConcept.getCurrentValue() ?? null,
        markuped_movement: await markupedMovement.getCurrentValue() ?? null,
        markuped_cards_adoption: await markupedAdoption.getCurrentValue() ?? null,
        markuped_detail: await markupedDetail.getCurrentValue() ?? null,
      })
      await router.push(`/decks/${deck.id}`)
    } else {
      const deckRef = await addDoc(decksRef, {
        created_by: user.uid,
        card_ids: selectedCardIds,
        name,
        concept: concept !== '' ? concept : undefined,
        movement: movement !== '' ? movement : undefined,
        cards_adoption: adoption !== '' ? adoption : undefined,
        detail: detail !== '' ? detail : undefined,
        youtube_id:
          youtubeURL !== '' && youtubeIdCap !== null
            ? youtubeIdCap[1]
            : undefined,
        is_public: isPublic,
        is_recommended: isRecommended,
        markuped_concept: markupedConcept,
        markuped_movement: markupedMovement,
        markuped_cards_adoption: markupedAdoption,
        markuped_detail: markupedDetail,
      })
      await router.push(`/decks/${deckRef.id}`)
    }
  }
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
              maxNum={20}
              maxNumOfEachCard={2}
            />
          </>
        ) : (
          <>
            <CardList
              columns={[4, 5, 6]}
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
                    作戦やコンセプト、おすすめの対象者などが伝わる簡潔な名前を設定しましょう。
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl>
                {/* htmlFor='' はラベルをクリックするとプレビュー切り替えスイッチが反応するバグの回避のため */}
                <FormLabel htmlFor=''>コンセプト{isAdmin === false && '(任意)'}</FormLabel>
                <PreviewRichEditor
                  textareaValue={concept}
                  defaultEnablePreview={!!(deck?.markuped_concept)}
                  onChangeTextareaValue={value => setConcept(value)}
                  onResetTextareaValue={async () => {
                    const editorValue = await markupedConcept.getCurrentEditorjsInstance()?.save()
                    if (editorValue) {
                      setConcept(editorValueToString(editorValue))
                    }
                  }}
                  onResetRichEditor={() => { }}
                  {...markupedConcept.props}
                />
                <FormHelperText>
                  どのデッキのコンセプトを説明しましょう。
                </FormHelperText>
              </FormControl>
              <FormControl>
                {/* htmlFor='' はラベルをクリックするとプレビュー切り替えスイッチが反応するバグの回避のため */}
                <FormLabel htmlFor=''>立ち回り方{isAdmin === false && '(任意)'}</FormLabel>
                <PreviewRichEditor
                  textareaValue={movement}
                  defaultEnablePreview={!!(deck?.markuped_movement)}
                  onChangeTextareaValue={value => setMovement(value)}
                  onResetTextareaValue={async () => {
                    const editorValue = await markupedMovement.getCurrentEditorjsInstance()?.save()
                    if (editorValue) {
                      setMovement(editorValueToString(editorValue))
                    }
                  }}
                  onResetRichEditor={() => { }}
                  {...markupedMovement.props}
                />
                <FormHelperText>
                  このデッキを使うときの試合開始から終了までの立ち回りを書きましょう。
                </FormHelperText>
              </FormControl>
              <FormControl>
                {/* htmlFor='' はラベルをクリックするとプレビュー切り替えスイッチが反応するバグの回避のため */}
                <FormLabel htmlFor=''>
                  カードの採用理由と代替カード{isAdmin === false && '(任意)'}
                </FormLabel>
                <PreviewRichEditor
                  textareaValue={adoption}
                  defaultEnablePreview={!!(deck?.markuped_cards_adoption)}
                  onChangeTextareaValue={value => setAdoption(value)}
                  onResetTextareaValue={async () => {
                    const editorValue = await markupedAdoption.getCurrentEditorjsInstance()?.save()
                    if (editorValue) {
                      setAdoption(editorValueToString(editorValue))
                    }
                  }}
                  onResetRichEditor={() => { }}
                  {...markupedAdoption.props}
                />
                <FormHelperText>
                  採用したカードの採用理由や代替できるカードの説明などをしましょう。
                </FormHelperText>
              </FormControl>
              <FormControl>
                {/* htmlFor='' はラベルをクリックするとプレビュー切り替えスイッチが反応するバグの回避のため */}
                <FormLabel htmlFor=''>
                  詳細やその他の情報{isAdmin === false && '(任意)'}
                </FormLabel>
                <PreviewRichEditor
                  textareaValue={detail}
                  defaultEnablePreview={!!(deck?.markuped_detail)}
                  onChangeTextareaValue={value => setDetail(value)}
                  onResetTextareaValue={async () => {
                    const editorValue = await markupedDetail.getCurrentEditorjsInstance()?.save()
                    if (editorValue) {
                      setDetail(editorValueToString(editorValue))
                    }
                  }}
                  onResetRichEditor={() => { }}
                  {...markupedDetail.props}
                />
                <FormHelperText>
                  どのカードをどのタイミングで使うかなどの解説を書きましょう。
                </FormHelperText>
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
              <FormControl>
                <Checkbox
                  isChecked={isPublic}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setIsPublic(true)
                    } else {
                      setIsPublic(false)
                      setIsRecommended(false)
                    }
                  }}
                >
                  公開する（URLを知っている人がアクセス可能）
                </Checkbox>
              </FormControl>
              {isAdmin && (
                <FormControl>
                  <Checkbox
                    isChecked={isRecommended}
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setIsPublic(true)
                        setIsRecommended(e.currentTarget.checked)
                      } else {
                        setIsRecommended(false)
                      }
                    }}
                  >
                    おすすめのデッキに表示する
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
                  onClick={handleSave}
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
