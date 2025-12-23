import { Config, Effect, Stream } from "effect"

// TODO:
// 1. Handle closing websocket when the program ends
// 2. color the users HEX to ANSI
// 3. JOIN and PART channel

// const TWITCH_IRC_URI = "wss://irc-ws.chat.twitch.tv:443"

// const ws = new WebSocket(TWITCH_IRC_URI)
//
// ws.addEventListener("open", () => {
//   console.log("Connected to Twitch Chat")
//   ws.send("CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands")
//   ws.send("PASS SCHMOOPIIE") // TODO: Change to real values
//   ws.send("NICK justinfan12345") // TODO: Change to real values
//
//   ws.send("JOIN #higherorderfunctioning")
//   console.log("Joined")
// })
//
// // THE MEAT
// ws.addEventListener("message", (event) => {
//   const data = typeof event.data === "string" ? event.data : event.data.toString()
//
//   if (data.includes("PING")) {
//     console.log("PING COMMING THROUGH")
//     const rest = data.replace("PING ", "")
//     ws.send(`PONG ${rest}`)
//   }
//
//   if (data.includes("PRIVMSG")) {
//     // @badge-info=;badges=broadcaster/1;client-nonce=267b3421080bf8dc8bd4d87f6d0a5dde;color=#0000FF;display -name=higherorderfunctioning;emotes=;first-msg=0;flags=;id=121ee8ee-6e7b-4263-afff-e166b0d5e57c;mod=0 ;returning-chatter=0;room-id=56185732;subscriber=0;tmi-sent-ts=1765994062217;turbo=0;user-id=56185732 ;user-type= :higherorderfunctioning!higherorderfunctioning@higherorderfunctioning.tmi.twitch.tv PRIVM SG #higherorderfunctioning :testing
//
//     const messageMatch = data.match(/PRIVMSG #\w+ :(.+)/)
//
//     const usernameMatch = data.match(/:(\w+)!/)
//     const displaynameMatch = data.match(/display-name=(\w+);/)
//     const user = displaynameMatch[1] ?? usernameMatch[1]
//
//     const timestampMatch = data.match(/tmi-sent-ts=(\d+);/)
//     const date = new Date(+timestampMatch[1])
//     const hour = `${date.getHours()}`.padStart(2, "0")
//     const minute = `${date.getMinutes()}`.padStart(2, "0")
//     const second = `${date.getSeconds()}`.padStart(2, "0")
//     const time = `${hour}:${minute}:${second}`
//
//     console.log(`(${time}) ${user}: ${messageMatch[1]}`)
//   }
// })
//
// ws.addEventListener("close", () => {
//   console.log("Disconnected from the Twitch Chat")
// })
//
// ws.addEventListener("error", () => {
//   console.log("Disconnected from the Twitch Chat, todo: Error")
// })

// Effect implementation
// - websocket connection
// - parse incoming message
//     - PING
//     - JOIN
//     - PART
//     - PRIVMSG
//     - *USERNOTICE : when someone subscribes etc.

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

    const source = yield* Stream.async((emit) => {})
  }).pipe(Effect.catchTag("ConfigError", () => Effect.succeed(Effect.die)))

const program = Effect.gen(function*() {
  const _ = yield* setup("higherorderfunctioning")
  return yield* Effect.log("Hello, World!")
})
