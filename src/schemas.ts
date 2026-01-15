import { Effect, ParseResult, pipe } from "effect"
import * as Schema from "effect/Schema"
import { HexColorSchema } from "./colors.js"

const KVSchema = <Key extends string, A, I extends string>(
  key: Key,
  valueSchema: Schema.Schema<I, A>
) =>
  pipe(
    Schema.TemplateLiteralParser(
      Schema.Literal(`${key}=`),
      Schema.String
    ),
    Schema.transformOrFail(
      Schema.TaggedStruct(key, { value: valueSchema }),
      {
        strict: false,
        decode: ([_tag, value]) => ParseResult.succeed({ _tag: key, value }),
        encode: ({ value }) => ParseResult.succeed([`${key}=`, String(value)])
      }
    ) // ,
    // (r) =>
    //   resultSchema
    //     ? Schema.transform(resultSchema, { strict: false, decode: () => ({}) as any, encode: () => ({}) as any })
    //     : r
  )

export const BadgeInfoSchema = KVSchema("badge-info", Schema.String)
export const BadgesSchema = KVSchema("badges", Schema.String)
export const ClientNonceSchema = KVSchema("client-nonce") // =2292959972d491fa6dcee93eaacc0d23;
export const ColorSchema = KVSchema("color", HexColorSchema) // =#0000FF;
export const DisplayNameSchema = KVSchema("display-name") // =higherorderfunctioning;
export const EmotesSchema = KVSchema("emotes")
export const FirstMsgSchema = KVSchema("first-msg") // =0;
export const FlagsSchema = KVSchema("flags")
export const IdSchema = KVSchema("id")
export const ModSchema = KVSchema("mod")
export const ReturningChatterSchema = KVSchema("returning-chatter") // =0;
export const RoomIdSchema = KVSchema("room-id") // =56185732;
export const SubscriberSchema = KVSchema("subscriber") // =0;
export const TmiSentTsSchema = KVSchema("tmi-sent-ts") // =1765995309365;
export const TurboSchema = KVSchema("turbo") // =0;
export const UserIdSchema = KVSchema("user-id") // =56185732;
export const UserTypeSchema = KVSchema("user-type") // =

export const TagsUnionSchema = Schema.Union(
  BadgeInfoSchema,
  BadgesSchema,
  ClientNonceSchema,
  ColorSchema,
  DisplayNameSchema,
  EmotesSchema,
  FirstMsgSchema,
  FlagsSchema,
  IdSchema,
  ModSchema,
  ReturningChatterSchema,
  RoomIdSchema,
  SubscriberSchema,
  TmiSentTsSchema,
  TurboSchema,
  UserIdSchema,
  UserTypeSchema,
  Schema.String
)

export const TagsSchema = Effect.pipe(
  Schema.String,
  Schema.transform(
    Schema.String,
    {
      strict: true,
      decode: (v) => v.startsWith("@") ? v.slice(1) : v,
      encode: (v) => `@${v}`
    }
  ),
  Schema.compose(Schema.split(";")),
  Schema.compose(Effect.pipe(
    TagsUnionSchema,
    Schema.Array
  ))
)

const InfoSchema = Schema.String
const ChannelMessageSchema = Schema.String

// PRIVMSG with proper capabilities (tags)
export const PrivateMessageSchema = Effect.pipe(
  Schema.Trim,
  Schema.compose(Schema.split(" :")),
  Schema.compose(Schema.Tuple(TagsSchema, InfoSchema, ChannelMessageSchema))
)

export const PingSchema = Schema.TemplateLiteralParser(
  Schema.Literal("PING "),
  Schema.String
)

export const MessageSchema = Schema.Union(/* PingSchema, */ PrivateMessageSchema /* , Schema.String */)
export type MessageSchema = typeof MessageSchema.Type
