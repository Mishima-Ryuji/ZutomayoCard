import {
  Box,
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
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Controller, useForm } from 'react-hook-form'
import { FiFile } from 'react-icons/fi'
import { DefaultLayout } from '~/components/Layout'
import { CardItem } from '~/components/card/Item'
import { Card, DocumentBaseKey, cardRef, fb, updateDoc } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
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
  const cardId = router.query.id

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [card, loading, error] = useDocumentData(
    typeof cardId === 'string' ? cardRef(cardId) : null
  )

  const { isAdmin, adminLoading } = useAuthState()

  useEffect(() => {
    if (adminLoading) return
    if (isAdmin) return
    void router.push(typeof cardId === 'string' ? `cards/${cardId}` : '/')
  }, [adminLoading])

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
    await router.push(`/cards/${card.id}`)
  })

  const cardData = watch()

  useEffect(() => {
    if (!card) return
    reset(
      remove<Card, keyof Card>(card, [
        'ref',
        'id',
        'created_at',
        'updated_at',
        'parent_id',
        'subcollections',
      ])
    )
  }, [card])
  if (!card && !loading && cardId !== undefined)
    return <DefaultErrorPage statusCode={404} />
  return (
    <DefaultLayout>
      {card && isAdmin ? (
        <form onSubmit={onSubmit}>
          <VStack width={'100%'} my={5} alignItems={'baseline'} gap={5}>
            <FormControl>
              <FormLabel htmlFor="file">画像</FormLabel>
              <FormHelperText mb={3}>
                公式の画像は使用が禁止されているため、自分で写真を撮ってアプロードしてください。画像は選択をすれば反映されるので、更新ボタンを押す必要はありません。
              </FormHelperText>
              <FileUpload
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0]
                  const ext = file?.name.split('.').pop()
                  if (!file || ext === undefined) return
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
              <CardItem card={card} width={200} highResolution />
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
                rules={{ required: true }}
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
                rules={{ required: true }}
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
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">カード名</FormLabel>
              <Input {...register('name', { required: true })} />
            </FormControl>
            <FormControl isInvalid={!!errors.name_furigana}>
              <FormLabel htmlFor="name_furigana">
                カード名（ふりがな）
              </FormLabel>
              <Input {...register('name_furigana', { required: true })} />
              <FormHelperText>
                英語はそのまま入力してください。例: DNA鍋 → DNAなべ
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={!!errors.effect}>
              <FormLabel htmlFor="effect">効果</FormLabel>
              <Textarea {...register('effect')} />
            </FormControl>
            {cardData.type === 'character' && (
              <>
                <FormControl isInvalid={!!errors.night_offensive_strength}>
                  <FormLabel htmlFor="night_offensive_strength">
                    攻撃力 (Night)
                  </FormLabel>
                  <Controller
                    name="night_offensive_strength"
                    rules={{ required: true }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <NumberInput
                        name="night_offensive_strength"
                        onChange={(v) =>
                          onChange(isNaN(parseInt(v)) ? undefined : parseInt(v))
                        }
                        value={value}
                      >
                        <NumberInputField />
                      </NumberInput>
                    )}
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.day_offensive_strength}>
                  <FormLabel htmlFor="day_offensive_strength">
                    攻撃力 (Day)
                  </FormLabel>
                  <Controller
                    rules={{ required: true }}
                    name="day_offensive_strength"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <NumberInput
                        name="day_offensive_strength"
                        onChange={(v) =>
                          onChange(isNaN(parseInt(v)) ? undefined : parseInt(v))
                        }
                        value={value}
                      >
                        <NumberInputField />
                      </NumberInput>
                    )}
                  />
                </FormControl>
              </>
            )}
            <FormControl isInvalid={!!errors.clock}>
              <FormLabel htmlFor="clock">時計</FormLabel>
              <Controller
                name="clock"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    name="clock"
                    onChange={(v) =>
                      onChange(isNaN(parseInt(v)) ? undefined : parseInt(v))
                    }
                    value={value}
                  >
                    <NumberInputField />
                  </NumberInput>
                )}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.power_cost}>
              <FormLabel htmlFor="power_cost">POWER COST</FormLabel>
              <Controller
                name="power_cost"
                rules={{ required: true }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    name="power_cost"
                    onChange={(v) =>
                      onChange(isNaN(parseInt(v)) ? undefined : parseInt(v))
                    }
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
            <FormControl isInvalid={!!errors.power}>
              <FormLabel htmlFor="power">SEND TO POWER</FormLabel>
              <Controller
                name="power"
                rules={{ required: true }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    name="power"
                    value={value}
                    onChange={(v) =>
                      onChange(isNaN(parseInt(v)) ? undefined : parseInt(v))
                    }
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
        <Box textAlign={'center'} p="5">
          <Spinner m="auto" />
        </Box>
      )}
    </DefaultLayout>
  )
}

export default Page
