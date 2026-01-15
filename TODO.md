## Plan: 
- Schemas
    - MessageSchema
        - check if it can be more than a string
- Smoke Tests
    - [x] PING
    - PRIVMSG

- Cli.ts 
    - use with channel name, to be `fancy`


Gotchas
1. Schema.compose type signature:
    - `Schema<B, A, R1>` & `Schema<C, B, R2>`
        creates `Schema<C,A, R1 | R2>`

2. Using Function.dual to create data-first or data-last style functions


