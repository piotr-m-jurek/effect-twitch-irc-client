import * as Effect from "effect"
import * as Schema from "effect/Schema"

// -[ ] JOIN
// -[ ] PART
// -[ ] *USERNOTICE : when someone subscribes etc.

// PRIVMSG
// const RGBFromHexSchema = pipe(
//   Schema.String,
//   Schema.compose(Schema.TemplateLiteralParser(
//     Schema.Literal("#"),
//     Schema.String.pipe(Schema.length(2)), // 0000FF;
//     Schema.String.pipe(Schema.length(2)), // 0000FF;
//     Schema.String.pipe(Schema.length(2)) // 0000FF;
//   )),
//   Schema.transform(Schema.Struct({ r: Schema.Number, g: Schema.Number, b: Schema.Number }), {
//     strict: false,
//     decode(fromA, fromI) {
//       return { r: 0, g: 0, b: 0 }
//     },
//     encode(toI, toA) {
//       return ["#", toI.r, toI.g, toI.b]
//     }
//   })
// )
//
// const ColorFromRawSchema = pipe(
//   Schema.String,
//   Schema.compose(
//     Schema.TemplateLiteralParser(
//       Schema.Literal("color=#"), // 0000FF;
//       Schema.StringFromHex
//     )
//   )
// )
//
// const PrivateMessageSchema = pipe(
//   Schema.String,
//   Schema.compose(
//     Schema.TemplateLiteralParser(
//       Schema.Literal("color=") // #0000FF;
//     )
//   )
// )
