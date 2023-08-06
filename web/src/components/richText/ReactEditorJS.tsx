import { EditorConfig, OutputData } from "@editorjs/editorjs"
import { createReactEditorJS } from "react-editor-js"

export interface EditorCore {
  destroy(): Promise<void>

  clear(): Promise<void>

  save(): Promise<OutputData>

  render(data: OutputData): Promise<void>
}

export const ReactEditorJS = createReactEditorJS()
export const tools: EditorConfig["tools"] = {
}
export const i18n: EditorConfig["i18n"] = {
  messages: {
    tools: {
      "Add a link": "リンクを追加",
    },
    toolNames: {
      "Text": "テキスト",
    },
  }
}
