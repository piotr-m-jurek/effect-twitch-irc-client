import * as Effect from "effect"
import * as Schema from "effect/Schema"

const KVSchema = <Key extends string, U>(
  key: Key,
  valueSchema: Schema.Schema<U>
) =>
  Effect.pipe(
    Schema.TemplateLiteralParser(
      Schema.Literal(`${key}=`),
      valueSchema
    ),
    Schema.transform(
      Schema.TaggedStruct(key, { value: valueSchema }),
      {
        strict: true,
        decode: ([_tag, value]) => ({ _tag: key, value }) as const,
        encode: (v) => [`${key}=`, v.value] as const
      }
    )
  )

export const BadgeInfoSchema = KVSchema("badge-info", Schema.String)
export const BadgesSchema = KVSchema("badges", Schema.String)
export const ClientNonce = KVSchema("client-nonce", Schema.String) // =2292959972d491fa6dcee93eaacc0d23;
export const ColorSchema = KVSchema("color", Schema.String) // =#0000FF;
export const DisplayNameSchema = KVSchema("display-name", Schema.String) // =higherorderfunctioning;
export const EmotesSchema = KVSchema("emotes", Schema.String)
export const FirstMsgSchema = KVSchema("first-msg", Schema.String) // =0;
export const FlagsSchema = KVSchema("flags", Schema.String)
export const IdSchema = KVSchema("id", Schema.String)
export const ModSchema = KVSchema("mod", Schema.String)
export const ReturningChatterSchema = KVSchema("returning-chatter", Schema.String) // =0;
export const RoomIdSchema = KVSchema("room-id", Schema.String) // =56185732;
export const SubscriberSchema = KVSchema("subscriber", Schema.String) // =0;
export const TmiSentTsSchema = KVSchema("tmi-sent-ts", Schema.String) // =1765995309365;
export const TurboSchema = KVSchema("turbo", Schema.String) // =0;
export const UserIdSchema = KVSchema("user-id", Schema.String) // =56185732;
export const UserTypeSchema = KVSchema("user-type", Schema.String) // =

// TODO: better name ffs
export const TagsUnionSchema = Schema.Union(
  BadgeInfoSchema,
  BadgesSchema,
  ClientNonce,
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
  Schema.compose(Schema.Array(TagsUnionSchema))
)

const InfoSchema = Schema.String
const MessageSchema = Schema.String

// PRIVMSG with proper capabilities (tags)
export const PrivateMessageSchema = Effect.pipe(
  Schema.Trim,
  Schema.compose(Schema.split(" :")),
  Schema.compose(Schema.Tuple(TagsSchema, InfoSchema, MessageSchema))
)

// TODO: consider using Schema.Class with a method of responding to PING
// TODO: Brand?
export const PingSchema = Schema.TemplateLiteralParser(
  Schema.Literal("PING "),
  Schema.String
)

// --- TagsSchema
// badge-info=;
// badges=broadcaster/1;
// client-nonce=2292959972d491fa6dcee93eaacc0d23;
// color=#0000FF;
// display-name=higherorderfunctioning;
// emotes=;
// first-msg=0;
// flags=;
// id =1a7ca370-f885-4933-b22b-600ae1552931;
// mod=0;
// returning-chatter=0;
// room-id=56185732;
// subscriber=0;
// tmi-sent-ts=1765995309365;
// turbo=0;
// user-id=56185732;
// user-type=

// --- InfoSchema
// higherorderfunctioning!higherorderfunctioning@higherorderfunctioning.tmi.twitch.tv PRIVMSG #higherorderfunctioning
// --- MessageSchema
// asdf\r\n"

export type TwitchChatMessage = typeof TwitchChatMessage.Type
