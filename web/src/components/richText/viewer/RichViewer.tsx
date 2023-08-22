import { SerializedEditorState } from "lexical"
import { FC } from "react"
import { RichEditor, useRichEditor } from "../editor/RichEditor"

interface RichViewerProps {
  value: SerializedEditorState
}
export const RichViewer: FC<RichViewerProps> = ({ value }) => {
  const { props } = useRichEditor({
    editorKey: "",
    defaultValue: value,
  })
  return (
    <div>
      <RichEditor
        {...props}
        editable={false}
      />
    </div>
  )
}
