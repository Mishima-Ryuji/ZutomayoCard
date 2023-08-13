import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState } from "lexical"
import { FC, MutableRefObject } from "react"

interface RefPluginProps {
  editorStateRef: MutableRefObject<EditorState | undefined>
}
export const RefPlugin: FC<RefPluginProps> = ({ editorStateRef }) => {
  const [editor] = useLexicalComposerContext()
  editorStateRef.current = editor.getEditorState()
  return (
    <>
      <OnChangePlugin onChange={editorState => { editorStateRef.current = editorState }} />
    </>
  )
}
