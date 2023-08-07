import { OutputData } from "@editorjs/editorjs"
import { FC } from "react"

interface RichViewerProps {
  value: OutputData
}
const RichViewer: FC<RichViewerProps> = ({ value }) => {
  return (
    <div className="editorjs-viewer">
      {value.blocks.map(block =>
        <div
          key={block.id}
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      )}
    </div>
  )
}

export default RichViewer
