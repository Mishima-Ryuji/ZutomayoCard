
import { Box, Divider, HStack } from "@chakra-ui/react"
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { $getRoot, EditorState, SerializedEditorState } from "lexical"
import dynamic from "next/dynamic"
import { FC, MutableRefObject, ReactNode, useCallback, useRef } from "react"
import { RefPlugin } from "../RefPlugin"
import { ZcwBoldToolbarItem } from "../ZcwBoldPlugin"
import { ZcwLinkNode, ZcwLinkPlugin, ZcwLinkToolbarItem } from "../ZcwLinkPlugin"
import styles from "./RichEditor.module.scss"

export interface RichEditorProps {
  editorKey: string
  placeholder?: ReactNode
  initialState?: SerializedEditorState | string | null
  editorStateRef: MutableRefObject<EditorState | undefined>
  editable?: boolean
}
const RichEditorComponent: FC<RichEditorProps> = ({ editorKey, placeholder, initialState = null, editorStateRef, editable = true, }) => {
  const initialConfig: InitialConfigType = {
    editorState: initialState !== null
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
        <HStack spacing={0.5} flexWrap="wrap">
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

export const RichEditor = dynamic(() => Promise.resolve(RichEditorComponent), { ssr: false })

export interface UseRichEditorOptions {
  editorKey: string
  defaultValue?: RichEditorProps["initialState"]
}
export const useRichEditor = ({ editorKey, defaultValue }: UseRichEditorOptions) => {
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
