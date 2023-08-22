import { Button, FormControl, FormHelperText, FormLabel, Icon, InputGroup, ListItem, Spinner, UnorderedList } from "@chakra-ui/react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Image from "next/image"
import { ChangeEventHandler, FC, ReactNode, useRef, useState } from "react"
import { FiFile } from "react-icons/fi"
import { v4 as uuidv4 } from "uuid"
import { fb } from "~/firebase"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"
import { SelectUniguriBalloonImage } from "../SelectUniguriBalloonImage"

interface InputUniguriBalloonImageProps {
  imageUrl: UniguriBalloon["image_url"] | null
  onChange: (imageUrl: UniguriBalloon["image_url"]) => void
  message: UniguriBalloon["message"]
  label?: ReactNode
}
export const InputUniguriBalloonImage: FC<InputUniguriBalloonImageProps> = ({ imageUrl, onChange, message, label = "画像" }) => {
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
      onChange(url)
    } catch (error) {
      console.error(error)
      alert(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <FormControl my={8}>
      <FormLabel>
        {label}
      </FormLabel>
      {imageUrl !== null &&
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
        onClickImage={image => onChange(image)}
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
    </FormControl>)
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

export const useInputUniguriBalloonImage = ({ message, defaultValue }: {
  message: UniguriBalloon["message"]
  defaultValue: UniguriBalloon["image_url"] | null
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValue ?? null)
  const isValid = imageUrl !== null
  const props = {
    imageUrl,
    onChange: setImageUrl,
    message,
  } satisfies Partial<InputUniguriBalloonImageProps>
  return {
    value: imageUrl,
    isValid,
    props,
  }
}
