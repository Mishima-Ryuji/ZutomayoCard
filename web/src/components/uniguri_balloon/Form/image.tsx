import { FormControl, FormHelperText, FormLabel, ListItem, Spinner, UnorderedList } from "@chakra-ui/react"
import { getDownloadURL, ref } from "firebase/storage"
import Image from "next/image"
import { ChangeEventHandler, FC, ReactNode, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { FileUpload, useFileUpload } from "~/components/FileUpload"
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
  const { upload, isUploading, props: fileUploadProps } = useFileUpload()
  const handleUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      const file = e.target.files?.[0]
      const ext = file?.name.split('.').pop()

      if (!file || ext === undefined) return
      const filename = `${file.name ?? "noname"}_${uuidv4()}.${ext}`
      const fullPath = `uniguri_balloons/${filename}`
      const uploadRef = ref(fb.storage, fullPath)
      await upload(uploadRef, file, { contentType: file?.type, })
      const url = await getDownloadURL(uploadRef)
      onChange(url)
    } catch (error) {
      console.error(error)
      alert(error)
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
        {...fileUploadProps}
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
