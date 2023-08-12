
import { OutputData } from "@editorjs/editorjs"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import dynamic from "next/dynamic"
import { FC, ReactNode } from "react"

export interface RichEditorProps {
  editorKey: string
  placeholder: ReactNode
}
const RichEditor: FC<RichEditorProps> = ({ editorKey, placeholder }) => {
  const initialConfig = {
    namespace: editorKey,
    theme: {},
    onError: console.error,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable className="outline-none" />}
        placeholder={<>{placeholder}</>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export default dynamic(async () => RichEditor, { ssr: false })

interface UseRichEditorOptions {
  editorKey: string
  defaultValue?: OutputData
}
export function useRichEditor({ editorKey, defaultValue }: UseRichEditorOptions) {
}
