import { Alert, AlertIcon, Badge, Box, Button, Checkbox, Collapse, Flex, FormControl, FormHelperText, FormLabel, HStack, Icon, InputGroup, ListItem, Radio, RadioGroup, Spinner, Textarea, UnorderedList } from "@chakra-ui/react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Image from "next/image"
import { ChangeEventHandler, FC, useRef, useState } from "react"
import { FiFile } from "react-icons/fi"
import { v4 as uuidv4 } from "uuid"
import { Timestamp, after, fb, maxTimestamp, minTimestamp, set } from "~/firebase"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"
import { InputTimestamp } from "../InputTimestamp"
import { SelectUniguriBalloonImage } from "./SelectUniguriBalloonImage"
import { UniguriBalloonView } from "./UniguriBalloonView"

export type UniguriBalloonInput = Pick<UniguriBalloon,
  | "message"
  | "image_url"
  | "enable"
  | "start_at"
  | "end_at"
>

type ViewTime = "everytime" | "with-limit"

interface UniguriBalloonFormProps {
  defaultValue: Partial<UniguriBalloonInput>
  onSubmit: (uniguriBalloon: UniguriBalloonInput) => void
  isSubmitting: boolean
}
export const UniguriBalloonForm: FC<UniguriBalloonFormProps> = ({ defaultValue, onSubmit, isSubmitting }) => {
  const [message, setMessage] = useState(defaultValue.message ?? "")
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValue.image_url ?? null)
  const [enable, setEnable] = useState(defaultValue.enable ?? false)
  const [startAt, setStartAt] = useState(defaultValue.start_at ?? minTimestamp)
  const [endAt, setEndAt] = useState(defaultValue.end_at ?? maxTimestamp)

  const isValidMessage = message.trim() !== ""
  const isValidImageUrl = imageUrl !== null
  const isValid = isValidMessage && isValidImageUrl

  const now = new Date().valueOf()
  const inLimit = startAt.toMillis() <= now && now <= endAt.toMillis()

  const [viewTime, setViewTime] = useState<ViewTime>(
    (defaultValue.start_at && defaultValue.enable) ? "everytime" : "with-limit"
  )

  const [isUploading, setIsUploading] = useState(false)
  const handleUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setIsUploading(true)
    try {
      const file = e.target.files?.[0]
      const ext = file?.name.split('.').pop()

      if (!file || ext === undefined) return
      const filename = `${file.name ?? "noname"}_${uuidv4()}.${ext}`
      const fullPath = `uniguri_balloons/${filename}`
      const uploadRef = ref(fb.storage, fullPath)
      await uploadBytes(uploadRef, file, { contentType: file?.type, })
      const url = await getDownloadURL(uploadRef)
      setImageUrl(url)
    } catch (error) {
      console.error(error)
      alert(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit({
      message,
      image_url: imageUrl,
      enable,
      start_at: startAt,
      end_at: endAt,
    })
  }

  return (
    <div>
      <FormControl my={8}>
        <FormLabel>
          1. うにぐりくんのセリフ
        </FormLabel>
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          maxLength={50}
          isInvalid={!isValidMessage}
        />
        <FormHelperText>
          <UnorderedList>
            <ListItem>
              50文字まで入力できます
            </ListItem>
          </UnorderedList>
        </FormHelperText>
      </FormControl>
      <FormControl my={8}>
        <FormLabel>
          2. 画像
        </FormLabel>
        {imageUrl &&
          <Image
            src={imageUrl}
            alt={message + "の画像"}
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
          />
        }

        <SelectUniguriBalloonImage
          selectedImage={imageUrl}
          onClickImage={image => setImageUrl(image)}
        />
        または
        <FileUpload
          onChange={handleUpload}
        />
        {isUploading &&
          <Spinner />
        }
        <FormHelperText>
          <UnorderedList>
            <ListItem>
              画像の形によっては見た目が崩れるため、
              なるべく正方形に近い画像をお勧めします。
            </ListItem>
            <ListItem>
              うにぐりくんじゃなくてもOKです！
            </ListItem>
          </UnorderedList>
        </FormHelperText>
      </FormControl>

      <FormControl my={8}>
        <FormLabel>
          3. 表示期間
        </FormLabel>
        <RadioGroup value={viewTime} onChange={value => setViewTime(value as ViewTime)}>
          <Radio value="everytime" onChange={e => {
            if (e.target.checked) {
              setStartAt(minTimestamp)
              setEndAt(maxTimestamp)
            }
          }}>
            ずっと
          </Radio>
          <Radio value="with-limit" onChange={e => {
            if (e.target.checked) {
              setStartAt(defaultValue.start_at ?? minTimestamp)
              setEndAt(defaultValue.end_at ?? maxTimestamp)
            }
          }}>
            表示期間を設ける
          </Radio>
        </RadioGroup>

        <Collapse in={viewTime === "with-limit"} animateOpacity>
          <Box px={4}>
            <InputTimestamp
              value={startAt}
              onChange={value => setStartAt(value)}
            />
            〜
            <InputTimestamp
              value={endAt}
              onChange={value => setEndAt(value)}
            />
            まで
            <ViewTimeSuggestions
              {...{ startAt, endAt, setStartAt, setEndAt, }}
            />
          </Box>
        </Collapse>

      </FormControl>

      <FormControl my={8}>
        <FormLabel>
          4. 公開設定
        </FormLabel>
        <Checkbox
          isChecked={enable}
          onChange={e => setEnable(e.target.checked)}
        >
          公開する
        </Checkbox>
      </FormControl>

      {imageUrl &&
        <FormControl my={8}>
          <FormLabel>
            5. プレビュー
          </FormLabel>
          <FormHelperText>
            トップページの右下に表示されます。
          </FormHelperText>
          <Flex flexDir="column">
            <Box minH="full" >
              <Badge>スマホ</Badge>
              <Flex
                bgColor="gray.100"
                p={6}
                w="fit-content"
                maxW="full"
                overflow="auto"
              >
                <UniguriBalloonView
                  mode="sp"
                  message={message}
                  imageUrl={imageUrl}
                />
              </Flex>
            </Box>
            <Box minH="full">
              <Badge>PC</Badge>
              <Flex
                bgColor="gray.100"
                w="fit-content"
                maxW="full"
                p={6}
                overflowX="auto"
              >
                <UniguriBalloonView
                  mode="pc"
                  message={message}
                  imageUrl={imageUrl}
                />
              </Flex>
            </Box>
          </Flex>
        </FormControl>
      }

      <Box my={4}>
        {enable
          ? inLimit
            ? <Alert status='info'>
              <AlertIcon />
              公開されます
            </Alert>
            : <Alert status='warning'>
              <AlertIcon />
              期間外のため 公開されません
            </Alert>
          : <Alert status='warning'>
            <AlertIcon />
            非公開設定になっているため 公開されません
          </Alert>
        }
      </Box>

      <Button
        colorScheme="purple"
        onClick={handleSubmit}
        isDisabled={!isValid || isSubmitting}
        rightIcon={
          isSubmitting ? <Spinner /> : undefined
        }
      >
        更新
      </Button>

    </div>
  )
}

interface ViewTimeSuggestionsProps {
  startAt: Timestamp
  endAt: Timestamp
  setStartAt: (ts: Timestamp) => void
  setEndAt: (ts: Timestamp) => void
}
const ViewTimeSuggestions: FC<ViewTimeSuggestionsProps> = ({ startAt, setStartAt, setEndAt }) => {
  const startDateText = `${startAt.toDate().getMonth() + 1}月${startAt.toDate().getDate()}日`
  return (
    <Box p={2}>
      もしかして...
      <HStack flexWrap="wrap" my={2} spacing={1}>

        <Button onClick={() => setEndAt(after(startAt, { day: 1 }))} size="xs">
          {startDateText}
          のみ
        </Button>

        <Button onClick={() => setEndAt(after(startAt, { day: 3 }))} size="xs">
          {startDateText}
          から3日間
        </Button>

        <Button onClick={() => setEndAt(after(startAt, { day: 7 * 1 }))} size="xs">
          {startDateText}
          から1週間
        </Button>

        <Button onClick={() => setEndAt(after(startAt, { day: 7 * 2 }))} size="xs">
          {startDateText}
          から2週間
        </Button>

        <Button onClick={() => setEndAt(after(startAt, { month: 1 }))} size="xs">
          {startDateText}
          から1ヶ月
        </Button>

        <Button onClick={() => setEndAt(after(startAt, { month: 2 }))} size="xs">
          {startDateText}
          から2ヶ月
        </Button>

        <Button onClick={() => setEndAt(after(startAt, { month: 3 }))} size="xs">
          {startDateText}
          から3ヶ月
        </Button>

      </HStack>

      <HStack flexWrap="wrap" my={2} spacing={1}>

        <Button onClick={() => {
          const start = set(after(Timestamp.now(), { day: 1 }), { hour: 0, minute: 0, second: 0, milliSeccond: 0 })
          setStartAt(start)
          setEndAt(after(start, { day: 1 }))
        }} size="xs">
          明日のみ
        </Button>

        <Button onClick={() => {
          const start = set(after(Timestamp.now(), { month: 1 }), { day: 1, hour: 0, minute: 0, second: 0, milliSeccond: 0 })
          setStartAt(start)
          setEndAt(after(start, { month: 1 }))
        }} size="xs">
          来月のみ
        </Button>

      </HStack>

    </Box>)
}

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
      <Button leftIcon={<Icon as={FiFile} />}>アップロード</Button>
    </InputGroup>
  )
}
