import { OutputData } from "@editorjs/editorjs"

export const editorValueFromString = (text: string): OutputData => {
  return {
    blocks: text.split("\n").map(line => ({
      "type": "paragraph",
      "data": {
        "text": line,
      },
    })),
  }
}
export const editorValueToString = (editorValue: OutputData): string =>
  editorValue.blocks.map(block =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    block.data?.text ?? ""
  ).join("\n")

