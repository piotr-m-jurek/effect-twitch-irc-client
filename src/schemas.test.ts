import { describe, expect, it } from "@effect/vitest"
import { pipe } from "effect"
import * as Array from "effect/Array"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { BadgeInfoSchema, PingSchema, PrivateMessageSchema, TagsSchema } from "./schemas.js"

describe("PING Schema", () => {
  it("parses ping schema", () => {
    const input = "PING :tmi.twitch.tv"
    const result = Schema.decodeSync(PingSchema)(input)
    expect(result).toEqual(["PING ", ":tmi.twitch.tv"])
  })
})

describe("PRIVMSG Schema", () => {
  const input =
    "@badge-info=;badges=broadcaster/1;client-nonce=28e05b1c83f1e916ca1710c44b014515;color=#0000FF;display-name=foofoo;emotes=62835:0-10;first-msg=0;flags=;id=f80a19d6-e35a-4273-82d0-cd87f614e767;mod=0;room-id=713936733;subscriber=0;tmi-sent-ts=1642696567751;turbo=0;user-id=713936733;user-type= :foofoo!foofoo@foofoo.tmi.twitch.tv PRIVMSG #bar :bleedPurple"

  it("parses into tuple of length 3", () => {
    expect(Schema.decodeSync(PrivateMessageSchema)(input).length).toEqual(3)
  })

  it("parses the info", () => {
    expect(Schema.decodeSync(PrivateMessageSchema)(input).at(1)).toEqual(
      "foofoo!foofoo@foofoo.tmi.twitch.tv PRIVMSG #bar"
    )
  })

  it("parses the message", () => {
    expect(Schema.decodeSync(PrivateMessageSchema)(input).at(2)).toEqual("bleedPurple")
  })

  it("parses tags", () => {
    const result = Schema.decodeSync(PrivateMessageSchema)(input).at(0)
    expect(Array.isArray(result)).toEqual(true)
  })
})

describe("TagsSchema", () => {
  const input =
    "@badge-info=;badges=broadcaster/1;client-nonce=28e05b1c83f1e916ca1710c44b014515;color=#0000FF;display-name=foofoo;emotes=62835:0-10;first-msg=0;flags=;id=f80a19d6-e35a-4273-82d0-cd87f614e767;mod=0;room-id=713936733;subscriber=0;tmi-sent-ts=1642696567751;turbo=0;user-id=713936733;user-type="

  it("parses values", () => {
    const result = Schema.decodeSync(TagsSchema)(input)
    expect(result).toMatchSnapshot()
  })

  it.effect("extracting values", () =>
    Effect.gen(function*() {
      const input =
        "@badge-info=;badges=broadcaster/1;client-nonce=28e05b1c83f1e916ca1710c44b014515;color=#0000FF;display-name=foofoo;emotes=62835:0-10;first-msg=0;flags=;id=f80a19d6-e35a-4273-82d0-cd87f614e767;mod=0;room-id=713936733;subscriber=0;tmi-sent-ts=1642696567751;turbo=0;user-id=713936733;user-type="
      const parseResult = yield* Schema.decodeUnknown(TagsSchema)(input)
      const result = pipe(
        parseResult,
        Array.filter(Schema.is(BadgeInfoSchema)),
        Array.head
      )
      yield* Effect.log(result)
      expect(result).toMatchSnapshot()
    }))

  it.effect("failing", () =>
    Effect.gen(function*() {
      const inputWithMissingBadgeInfo =
        "@badges=broadcaster/1;client-nonce=28e05b1c83f1e916ca1710c44b014515;color=#0000FF;display-name=foofoo;emotes=62835:0-10;first-msg=0;flags=;id=f80a19d6-e35a-4273-82d0-cd87f614e767;mod=0;room-id=713936733;subscriber=0;tmi-sent-ts=1642696567751;turbo=0;user-id=713936733;user-type="
      const parseResult = yield* Schema.decodeUnknown(TagsSchema)(inputWithMissingBadgeInfo)
      const result = pipe(
        parseResult,
        Array.filter(Schema.is(BadgeInfoSchema)),
        Array.head
      )
      yield* Effect.log(result)
      expect(result).toMatchSnapshot()
    }))
})
