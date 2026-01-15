import { BunRuntime } from "@effect/platform-bun"
import { Cause, Chunk, Config, Effect, Option, pipe, Schema, Stream } from "effect"
import { MessageSchema, PingSchema, PrivateMessageSchema } from "./schemas.js"

// TODO:
// 1. Handle closing websocket when the program ends
// 2. color the users HEX to ANSI
// 3. JOIN and PART channel for counting how many viewers are there

const TWITCH_IRC_URI = "wss://irc-ws.chat.twitch.tv:443"

const setup = (channelName: string) =>
  Effect.gen(function*() {
    const nickname = yield* Config.string("NICK")
    const password = yield* Config.string("PASS")

    const ws = new WebSocket(TWITCH_IRC_URI)

    yield* Effect.addFinalizer(() =>
      Effect.sync(() => {
        ws.close()
      })
    )

    ws.onopen = () => {
      ws.send("CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands")
      ws.send(`PASS ${password} `)
      ws.send(`NICK ${nickname}`)
      ws.send(`JOIN #${channelName}`)
    }

    yield* Effect.log(`Connected to ${channelName}`)

    const source = yield* Stream.async<MessageSchema | null, Cause.TimeoutException>((emit) => {
      ws.addEventListener("message", (event) => {
        void emit(pipe(
          event.data,
          Schema.decodeUnknown(MessageSchema),
          Effect.map((data) => Chunk.make(data)),
          Effect.catchTag("ParseError", () => Effect.succeed(Chunk.make(null)))
        ))
      })

      ws.addEventListener("close", () => {
        void emit(Effect.fail(Option.some(new Cause.TimeoutException())))
      })

      ws.addEventListener("error", () => {
        void emit(Effect.fail(Option.some(new Cause.TimeoutException())))
      })
    }).pipe(
      Stream.share({ capacity: "unbounded" })
    )

    const pingStream = pipe(
      source,
      Stream.filter(Schema.is(PingSchema)),
      Stream.take(1),
      //
      Stream.tap(([_, value]) =>
        Effect.gen(function*() {
          yield* Effect.logDebug(`Sending "PONG ${value}"`)
          ws.send(`PONG ${value}`)
        })
      )
    )

    const privateMessageStream = pipe(
      source,
      Stream.filter(Schema.is(PrivateMessageSchema)),
      Stream.take(1),
      //
      Stream.tap(([_tags, _, message]) => Effect.logDebug(`Got PRIVMSG ${message}`))
    )

    return Stream.merge(pingStream, privateMessageStream)
  }).pipe(Effect.scoped)

const program = setup("higherorderfunctioning")

BunRuntime.runMain(program)
