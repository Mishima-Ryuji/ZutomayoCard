
import { Divider, HStack } from "@chakra-ui/react"
import { OutputData } from "@editorjs/editorjs"
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import dynamic from "next/dynamic"
import { FC, ReactNode } from "react"
import ZcwLinkPlugin, { ZcwLinkNode, ZcwLinkToolbarItem } from "../ZcwLinkPlugin"
import styles from "./RichEditor.module.scss"

export interface RichEditorProps {
  editorKey: string
  placeholder: ReactNode
}
const RichEditor: FC<RichEditorProps> = ({ editorKey, placeholder }) => {
  const initialConfig: InitialConfigType = {
    namespace: editorKey,
    theme: {
      link: styles.link,
    },
    onError: console.error,
    nodes: [
      ZcwLinkNode,
    ],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <HStack spacing={0.5}>
        <ZcwLinkToolbarItem />
      </HStack>
      <Divider />
      <PlainTextPlugin
        contentEditable={<ContentEditable className={styles.contentEditable} />}
        placeholder={<>{placeholder}</>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <ZcwLinkPlugin />
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
