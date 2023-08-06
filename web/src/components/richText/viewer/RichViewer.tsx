import { chakra } from "@chakra-ui/react"
import { OutputData } from "@editorjs/editorjs"
import { FC } from "react"
import { ReactEditorJS, i18n, tools } from "../ReactEditorJS"

interface RichViewerProps {
  value: OutputData
}
const RichViewer: FC<RichViewerProps> = ({ value }) => {
  if (typeof window === "undefined") return <></>
  return (
    <chakra.div className="editorjs">
      <ReactEditorJS
        {...{ tools, i18n }}
        tunes={[]}
        defaultValue={value}
        readOnly
        tools={{}}
      />
    </chakra.div>
  )
}

export default RichViewer
