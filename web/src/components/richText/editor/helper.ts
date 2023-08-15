import { $getTextContent, EditorState } from "lexical"

export const editorValueToString = (editorState: EditorState): string => {
  return editorState.read(() => {
    return $getTextContent()
  })
}

