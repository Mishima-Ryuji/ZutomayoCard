'use client'

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Controller, useForm } from 'react-hook-form'
import { FiFile } from 'react-icons/fi'
import { DefaultLayout } from '~/components/Layout'
import { CardItem } from '~/components/card/Item'
import { Card, DocumentBaseKey, cardRef, fb, updateDoc } from '~/firebase'
import { remove } from '~/shared/utils'

type FileUploadProps = {
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const FileUpload = ({ onChange: handleChange }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick} mb={3}>
      <input
        type={'file'}
        multiple={false}
        accept={'image/*'}
        hidden
        ref={inputRef}
        onChange={handleChange}
      />
      <Button leftIcon={<Icon as={FiFile} />}>ファイルを選択</Button>
    </InputGroup>
  )
}

const Page = () => {
  const router = useRouter()
  const params = useParams()
  const cardId = params.id

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [card, loading, error] = useDocumentData(
    typeof cardId === 'string' ? cardRef(cardId) : null
  )
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<Omit<Card, 'image' | DocumentBaseKey>>({ mode: 'onChange' })

  const onSubmit = handleSubmit(async (data) => {
    if (!card) return
    setIsSubmitting(true)
    await updateDoc(card.ref, data)
    router.push('/')
  })

  const cardData = watch()

  console.log(errors)
  console.log(isValid)

  useEffect(() => {
    if (!card) return
    reset({
      ...remove<Card, keyof Card>(card, [
        'ref',
        'id',
        'created_at',
        'updated_at',
        'parent_id',
        'subcollections',
      ]),
      element: 'flame',
      type: card.type ?? 'character',
    })
  }, [card])

  return (
    <DefaultLayout>
      {card ? (
        <form onSubmit={onSubmit}>
          <VStack width={'100%'} my={5} alignItems={'baseline'} gap={5}>
            <FormControl>
              <FormLabel htmlFor="file">画像</FormLabel>
              <FormHelperText mb={3}>
                公式の画像は使用が禁止されているため、自分で写真を撮ってアプロードしてください。
              </FormHelperText>
              <FileUpload
                onChange={async (e) => {
                  if (!card) return
                  const file = e.currentTarget.files?.[0]
                  const ext = file?.name.split('.').pop()
                  if (!file || !ext) return
                  const filename = `${card.id}.${ext}`
                  const fullPath = `cards/${filename}`
                  const uploadRef = ref(fb.storage, fullPath)
                  await uploadBytes(uploadRef, file)
                  const url = await getDownloadURL(uploadRef)
                  await updateDoc(card.ref, {
                    image: {
                      filename,
                      full_path: fullPath,
                      url,
                    },
                  })
                }}
              />
              <CardItem card={card} width={200} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="rarity">レアリティ</FormLabel>
              <Select
                placeholder="選択してください"
                isInvalid={!!errors.rarity}
                {...register('rarity', { required: true })}
              >
                <option value="N">N</option>
                <option value="N+">N+</option>
                <option value="R">R</option>
                <option value="R+">R+</option>
                <option value="SR">SR</option>
                <option value="SR+">SR+</option>
                <option value="UR">UR</option>
                <option value="SE">SE</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="element">属性</FormLabel>
              <Controller
                name="element"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup name="element" onChange={onChange} value={value}>
                    <Stack direction="row" gap={4}>
                      <Radio value="flame">炎</Radio>
                      <Radio value="wind">風</Radio>
                      <Radio value="darkness">闇</Radio>
                      <Radio value="electricity">電気</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="type">種別</FormLabel>
              <Controller
                name="type"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup name="type" onChange={onChange} value={value}>
                    <Stack direction="row" gap={4}>
                      <Radio value="character">Character</Radio>
                      <Radio value="enchant">Enchant</Radio>
                      <Radio value="area_enchant">Area Enchant</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">カード名</FormLabel>
              <Input
                isInvalid={!!errors.name}
                {...register('name', { required: true })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name_furigana">
                カード名（ふりがな）
              </FormLabel>
              <Input
                isInvalid={!!errors.name_furigana}
                {...register('name_furigana', { required: true })}
              />
              <FormHelperText>
                英語はそのまま入力してください。例: DNA鍋 → DNAなべ
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="effect">効果</FormLabel>
              <Textarea isInvalid={!!errors.effect} {...register('effect')} />
            </FormControl>
            {cardData.type === 'character' && (
              <>
                <FormControl>
                  <FormLabel htmlFor="day_offensive_strength">
                    攻撃力 (Day)
                  </FormLabel>
                  <Controller
                    rules={{ required: true }}
                    name="day_offensive_strength"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <NumberInput
                        isInvalid={!!errors.day_offensive_strength}
                        name="day_offensive_strength"
                        onChange={onChange}
                        value={value}
                      >
                        <NumberInputField />
                      </NumberInput>
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="night_offensive_strength">
                    攻撃力 (Night)
                  </FormLabel>
                  <Controller
                    name="night_offensive_strength"
                    rules={{ required: true }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <NumberInput
                        isInvalid={!!errors.night_offensive_strength}
                        name="night_offensive_strength"
                        onChange={onChange}
                        value={value}
                      >
                        <NumberInputField />
                      </NumberInput>
                    )}
                  />
                </FormControl>
              </>
            )}
            <FormControl>
              <FormLabel htmlFor="clock">時計</FormLabel>
              <Controller
                name="clock"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    isInvalid={!!errors.clock}
                    name="clock"
                    onChange={onChange}
                    value={value}
                  >
                    <NumberInputField />
                  </NumberInput>
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="power_cost">POWER COST</FormLabel>
              <Controller
                name="power_cost"
                rules={{ required: true }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    isInvalid={!!errors.power_cost}
                    name="power_cost"
                    onChange={onChange}
                    value={value}
                  >
                    <NumberInputField />
                  </NumberInput>
                )}
              />
              <FormHelperText>
                存在しない場合は0を入れてください。
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="power">SEND TO POWER</FormLabel>
              <Controller
                name="power"
                rules={{ required: true }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    isInvalid={!!errors.power}
                    name="power"
                    onChange={onChange}
                    value={value}
                  >
                    <NumberInputField />
                  </NumberInput>
                )}
              />
              <FormHelperText>
                存在しない場合は0を入れてください。
              </FormHelperText>
            </FormControl>
            <Button
              mt={4}
              colorScheme="purple"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isValid || !isDirty}
            >
              更新
            </Button>
          </VStack>
        </form>
      ) : (
        <Spinner m="auto" />
      )}
    </DefaultLayout>
  )
}

export default Page
