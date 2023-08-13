
import { Box, Divider, HStack } from "@chakra-ui/react"
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { $getRoot, EditorState, SerializedEditorState } from "lexical"
import dynamic from "next/dynamic"
import { FC, MutableRefObject, ReactNode, useCallback, useRef } from "react"
import { ZcwBoldToolbarItem } from "../ZcwBoldPlugin"
import ZcwLinkPlugin, { ZcwLinkNode, ZcwLinkToolbarItem } from "../ZcwLinkPlugin"
import RefPlugin from "./RefPlugin"
import styles from "./RichEditor.module.scss"

export interface RichEditorProps {
  editorKey: string
  placeholder?: ReactNode
  initialState?: SerializedEditorState | null
  editorStateRef: MutableRefObject<EditorState | undefined>
  editable?: boolean
}
const RichEditor: FC<RichEditorProps> = ({ editorKey, placeholder, initialState = null, editorStateRef, editable = true, }) => {
  const initialConfig: InitialConfigType = {
    editorState: initialState
      ? editor => {
        const parsedEditorState = editor.parseEditorState(initialState)
        editor.setEditorState(parsedEditorState)
      }
      : null,
    namespace: editorKey,
    theme: {
      link: styles.link,
    },
    onError: console.error,
    nodes: [
      ZcwLinkNode,
    ],
    editable,
  }

  const Container = ({ children }: { children: ReactNode }) =>
    editable
      ? <Box border="solid 1px" borderColor="blue.300" rounded="base">
        <HStack spacing={0.5}>
          <ZcwLinkToolbarItem />
          <ZcwBoldToolbarItem />
        </HStack>
        <Divider />
        {children}
      </Box>
      : <Box>
        {children}
      </Box>
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Container>

        <LexicalRichTextPlugin
          contentEditable={<ContentEditable className={styles.contentEditable} />}
          placeholder={<>{placeholder}</>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ZcwLinkPlugin />
        <RefPlugin editorStateRef={editorStateRef} />
      </Container>
    </LexicalComposer>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export default dynamic(async () => RichEditor, { ssr: false })

interface UseRichEditorOptions {
  editorKey: string
  defaultValue?: SerializedEditorState
}
export function useRichEditor({ editorKey, defaultValue }: UseRichEditorOptions) {
  const editorStateRef = useRef<EditorState>()
  const props = {
    editorKey,
    initialState: defaultValue,
    editorStateRef,
  } satisfies RichEditorProps
  const getCurrentData = useCallback(() => {
    return editorStateRef.current?.toJSON()
  }, [])
  const getCurrentDataText = useCallback(() => {
    return editorStateRef.current?.read(() => {
      return $getRoot().getTextContent()
    })
  }, [])
  return {
    editorStateRef,
    props,
    getCurrentData,
    getCurrentDataText,
  }
}
