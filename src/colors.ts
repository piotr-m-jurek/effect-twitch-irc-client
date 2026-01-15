import { Console, Effect, pipe, Schema } from "effect"
import * as Function from "effect/Function"

export const HexColorSchema = Schema.String.pipe(Schema.brand("HexColor"))
export type HexColor = typeof HexColorSchema.Type

const reset = "\x1b[0m"

// INFO:
// ESC[38;2;⟨r⟩;⟨g⟩;⟨b⟩m Select RGB foreground color
// ESC[48;2;⟨r⟩;⟨g⟩;⟨b⟩m Select RGB background color
export function hexToAnsi(
  hex: HexColor,
  config: { type: "foreground" | "background" } = { type: "foreground" }
): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const type = config.type === "foreground" ? "[38;2;" : "[48;2;"

  return `\x1b${type}${r};${g};${b}m`
}

export const fgColor: {
  (hex: HexColor): (text: string) => string
  (text: string, hex: HexColor): string
} = Function.dual(2, (text: string, color: HexColor) => {
  const notFinished = text.replace(reset, "")
  return [hexToAnsi(color), notFinished, reset].join("")
})

export const bgColor: {
  (hex: HexColor): (text: string) => string
  (text: string): (hex: HexColor) => string
} = Function.dual(
  2,
  (text: string, color: HexColor) => {
    const notFinished = text.replace(reset, "")
    return [hexToAnsi(color, { type: "background" }), notFinished, reset].join("")
  }
)

const brightRed = HexColorSchema.make("#facb20")
const niceBlue = HexColorSchema.make("#195db0")

fgColor("Hello, World!", brightRed)

Effect.runPromise(
  Console.log(pipe(
    fgColor("Hello, World!", brightRed),
    //
    bgColor(niceBlue)
  ))
)
