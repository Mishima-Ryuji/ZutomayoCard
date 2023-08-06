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
    ui: {
      "blockTunes": {
        "toggler": {
          "Click to tune": "クリックして移動",
          "or drag to move": "ドラッグして移動"
        },
      },
      "toolbar": {
        "toolbox": {
          "Add": "行を追加"
        }
      }
    },
    tools: {
      link: {
        "Add a link": "リンクを追加",
      },
    },
    toolNames: {
      "Text": "テキスト",
      "Link": "URL",
      "Bold": "太文字",
      "Italic": "斜体",
    },
    blockTunes: {
      "delete": {
        "Delete": "行を削除",
        "Click to delete": "削除してもいいですか？",
      },
      "moveUp": {
        "Move up": "上に移動"
      },
      "moveDown": {
        "Move down": "下に移動"
      }
    },
  }
}
