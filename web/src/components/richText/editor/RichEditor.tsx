
import { OutputData } from "@editorjs/editorjs"
import dynamic from "next/dynamic"
import { FC, ReactNode } from "react"

export interface RichEditorProps {
  placeholder: ReactNode
}
const RichEditor: FC<RichEditorProps> = () => {
  return (
    <></>
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
