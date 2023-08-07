
import { chakra } from "@chakra-ui/react"
import { EditorConfig, OutputData } from "@editorjs/editorjs"
import { FC, useCallback, useRef, useState } from "react"
import { EditorCore, ReactEditorJS, i18n, tools } from "../ReactEditorJS"


export interface RichEditorProps {
  defaultValue: EditorConfig['data']
  onInitialize: (editor: EditorCore) => void
  isInitializing: boolean
  placeholder?: string | false
}
const _RichEditor: FC<RichEditorProps> = ({ onInitialize, defaultValue, placeholder = false }) => {
  if (typeof window === "undefined") return <></>
  return (
    <chakra.div className="editorjs" zIndex={1} position="relative" padding={2} border="solid 2px" borderColor="blue.300" borderRadius="md">
      <ReactEditorJS
        {...{ tools, i18n }}
        tunes={[]}
        inlineToolbar={["bold", "italic", "link"]}
        onInitialize={onInitialize}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </chakra.div>
  )
}

export default _RichEditor

interface UseRichEditorOptions {
  defaultValue?: OutputData
}
export function useRichEditor({ defaultValue }: UseRichEditorOptions = {}) {
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

  const props: RichEditorProps = {
    onInitialize,
    defaultValue,
    isInitializing,
  }
  return {
    props,
    getCurrentEditorjsInstance,
    isInitializing,
  }
}
