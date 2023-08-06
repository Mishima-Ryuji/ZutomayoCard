import dynamic from "next/dynamic"
import { useRichEditor as _useRichEditor } from "./RichEditor"

export const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false })
export const useRichEditor = _useRichEditor
