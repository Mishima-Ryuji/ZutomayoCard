import { Button, Icon, InputGroup, Spinner, useFormControlContext } from "@chakra-ui/react"
import { StorageReference, UploadMetadata, uploadBytes } from "firebase/storage"
import { ChangeEventHandler, ReactNode, useRef, useState } from "react"
import { FiFile } from "react-icons/fi"

export type FileUploadProps = {
  onChange?: ChangeEventHandler<HTMLInputElement>
  accept?: string
  multiple?: boolean
  children?: ReactNode
  isUploading?: boolean
}

export const FileUpload = ({
  onChange: handleChange,
  accept = "image/*",
  multiple = false,
  children = "アップロード",
  isUploading = false,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => inputRef.current?.click()

  const control = useFormControlContext()

  return (
    <InputGroup onClick={handleClick} mb={3}>
      <input
        type={'file'}
        multiple={multiple}
        accept={accept}
        hidden
        ref={inputRef}
        onChange={handleChange}
      />
      <Button
        leftIcon={<Icon as={FiFile} />}
        rightIcon={isUploading ? <Spinner /> : undefined}
        isDisabled={control.isDisabled || isUploading}
      >
        {children}
      </Button>
    </InputGroup>
  )
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const upload = async (ref: StorageReference, file: File, metadata?: UploadMetadata | undefined) => {
    setIsUploading(true)
    try {
      return await uploadBytes(ref, file, metadata)
    } finally {
      setIsUploading(false)
    }
  }
  const props = {
    isUploading,
  } satisfies FileUploadProps
  return {
    upload,
    isUploading,
    props,
  }
}
