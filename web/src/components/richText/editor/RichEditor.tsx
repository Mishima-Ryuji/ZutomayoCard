
import { chakra } from "@chakra-ui/react"
import { EditorConfig, OutputData } from "@editorjs/editorjs"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { EditorCore, ReactEditorJS, i18n, tools } from "../ReactEditorJS"


export interface RichEditorProps {
  editorKey: string
  defaultValue: EditorConfig['data']
  onInitialize: (editor: EditorCore) => void
  isInitializing: boolean
  onDestroyed: () => void
  placeholder?: string | false
}
const _RichEditor: FC<RichEditorProps> = ({ editorKey, onInitialize, defaultValue, placeholder = false, onDestroyed, }) => {
  if (typeof window === "undefined") return <></>
  useEffect(() => {
    return () => {
      onDestroyed()
    }
  }, [])
  return (
    <chakra.div className="editorjs" zIndex={1} position="relative" padding={2} border="solid 2px" borderColor="blue.300" borderRadius="md">
      <ReactEditorJS
        {...{ tools, i18n }}
        tunes={[]}
        inlineToolbar={["bold", "italic", "link"]}
        onInitialize={onInitialize}
        defaultValue={defaultValue}
        placeholder={placeholder}
        holder={editorKey}
      />
    </chakra.div>
  )
}

export default _RichEditor

interface UseRichEditorOptions {
  editorKey: string
  defaultValue?: OutputData
}
export function useRichEditor({ editorKey, defaultValue }: UseRichEditorOptions) {
  const editorCore = useRef<EditorCore>()
  const [isInitializing, setIsInitializing] = useState(true)
  const onInitialize = useCallback((instance: EditorCore) => {
    editorCore.current = instance
    setIsInitializing(false)
  }, [])

  const getCurrentEditorjsInstance = useCallback(() =>
    editorCore.current,
    [],
  )
  const getCurrentValue = async () => {
    if (isDestroyed) return null
    return await getCurrentEditorjsInstance()?.save() ?? null
  }

  const [isDestroyed, setIsDestroyed] = useState(false)
  const onDestroyed = useCallback(() => {
    setIsDestroyed(true)
  }, [])

  const props: RichEditorProps = {
    editorKey,
    onInitialize,
    defaultValue,
    isInitializing,
    onDestroyed,
  }
  return {
    props,
    getCurrentEditorjsInstance,
    getCurrentValue,
    isInitializing,
  }
}
