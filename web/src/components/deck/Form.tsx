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
import { deleteField } from 'firebase/firestore'
import { SerializedEditorState } from "lexical"
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { CardList } from '~/components/card/List'
import { CardsSelector } from '~/components/card/Selector'
import { Card, Deck, addDoc, decksRef, updateDoc } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { isBlank } from '~/shared/utils'
import { PreviewRichEditor, usePreviewRichEditor } from '../richText/editor/preview/PreviewRichEditor'

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
  const detail = usePreviewRichEditor({
    textareaDefaultValue: deck?.detail ?? "",
    defaultEnablePreview: !!deck?.markuped_detail,
    editorKey: "detail",
    defaultValue: deck?.markuped_detail as SerializedEditorState ?? deck?.detail ?? "",
  })
  const concept = usePreviewRichEditor({
    textareaDefaultValue: deck?.concept ?? "",
    defaultEnablePreview: !!deck?.markuped_concept,
    editorKey: "concept",
    defaultValue: deck?.markuped_concept as SerializedEditorState ?? deck?.concept ?? "",
  })
  const movement = usePreviewRichEditor({
    textareaDefaultValue: deck?.movement ?? "",
    defaultEnablePreview: !!deck?.markuped_movement,
    editorKey: "movement",
    defaultValue: deck?.markuped_movement as SerializedEditorState ?? deck?.movement ?? "",
  })
  const adoption = usePreviewRichEditor({
    textareaDefaultValue: deck?.cards_adoption ?? "",
    defaultEnablePreview: !!deck?.markuped_cards_adoption,
    editorKey: "adoption",
    defaultValue: deck?.markuped_cards_adoption as SerializedEditorState ?? deck?.cards_adoption ?? "",
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
        concept: concept.textareaValue !== '' ? concept.textareaValue : deleteField(),
        movement: movement.textareaValue !== '' ? movement.textareaValue : deleteField(),
        cards_adoption:
          adoption.textareaValue !== '' ? adoption.textareaValue : deleteField(),
        detail: detail.textareaValue !== '' ? detail.textareaValue : deleteField(),
        youtube_id:
          youtubeURL !== '' && youtubeIdCap !== null
            ? youtubeIdCap[1]
            : deleteField(),
        markuped_concept: concept.isEnableRich
          ? (concept.richEditor.getCurrentData() ?? null)
          : null,
        markuped_movement: movement.isEnableRich
          ? (movement.richEditor.getCurrentData() ?? null)
          : null,
        markuped_cards_adoption: adoption.isEnableRich
          ? (adoption.richEditor.getCurrentData() ?? null)
          : null,
        markuped_detail: detail.isEnableRich
          ? (detail.richEditor.getCurrentData() ?? null)
          : null,
      })
      await router.push(`/decks/${deck.id}`)
    } else {
      const deckRef = await addDoc(decksRef, {
        created_by: user.uid,
        card_ids: selectedCardIds,
        name,
        concept: concept.textareaValue !== '' ? concept.textareaValue : undefined,
        movement: movement.textareaValue !== '' ? movement.textareaValue : undefined,
        cards_adoption:
          adoption.textareaValue !== '' ? adoption.textareaValue : deleteField(),
        detail: detail.textareaValue !== '' ? detail.textareaValue : deleteField(),
        youtube_id:
          youtubeURL !== '' && youtubeIdCap !== null
            ? youtubeIdCap[1]
            : undefined,
        is_public: isPublic,
        is_recommended: isRecommended,
        markuped_concept: concept.isEnableRich
          ? (concept.richEditor.getCurrentData() ?? null)
          : null,
        markuped_movement: movement.isEnableRich
          ? (movement.richEditor.getCurrentData() ?? null)
          : null,
        markuped_cards_adoption: adoption.isEnableRich
          ? (adoption.richEditor.getCurrentData() ?? null)
          : null,
        markuped_detail: detail.isEnableRich
          ? (detail.richEditor.getCurrentData() ?? null)
          : null,
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
                  {...concept.previewProps}
                />
                <FormHelperText>
                  どのデッキのコンセプトを説明しましょう。
                </FormHelperText>
              </FormControl>
              <FormControl>
                {/* htmlFor='' はラベルをクリックするとプレビュー切り替えスイッチが反応するバグの回避のため */}
                <FormLabel htmlFor=''>立ち回り方{isAdmin === false && '(任意)'}</FormLabel>
                <PreviewRichEditor
                  {...movement.previewProps}
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
                  {...adoption.previewProps}
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
                  {...detail.previewProps}
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
