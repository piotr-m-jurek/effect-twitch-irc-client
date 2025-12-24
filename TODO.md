## Plan: 
- Don't stream with Spotify
- Schemas
    - consider using HashMaps as the output
    - MessageSchema
        - check if it can be more than a string
- Smoke Tests
    - [x] PING
    - PRIVMSG


Gotchas
Schema.compose type signature:
- `Schema<B, A, R1>` & `Schema<C, B, R2>`
    creates `Schema<C,A, R1 | R2>`
