---
tags: [TechnicalPlan, Networking, Server, WebSocket, Authoritative]
type: Technical Specification
---

# 13 - NETWORKING AND AUTHORITATIVE SERVER

> Online 1v1 is a later delivery stage. Build the deterministic `shared/` simulation and local match first, then run that same reducer on a Node.js server. See `TechnicalPlan/14` for stage gates.

## Authority and transport

- The server owns the match seed, tick, random stream, legal commands, economy, combat, visibility and result. Clients send **intent**, never damage totals, rewards, positions or victory claims.
- Use the standard browser WebSocket API and a small Node.js WebSocket server initially. Add room or matchmaking frameworks only when measured requirements justify them. Serve static client assets and `wss://` behind HTTPS.
- Version the protocol. Each command carries `matchId`, seat/session, monotonically increasing client sequence number, requested action and parameters. The server assigns the accepted simulation tick and replies with an acknowledgement or rejection reason. Reject duplicate, stale, unauthorized, out-of-range and unaffordable actions.
- A room has two player seats and optional explicitly authorized spectators. Rate-limit commands per seat and action type; validate reconnect tokens and apply a documented disconnect grace period before a forfeit.
- A local match uses the same command validation and simulation path with an in-process transport adapter. Local pause freezes its simulation. An online pause menu is visual only; online clients cannot submit speed or pause commands.

## Player-specific state

- Construct an **individual view state for each player on the server** after visibility has been updated. Unexplored terrain, invisible enemy units, traps, camp status, private hands, blessing offers, opponent shop information and concealed cooldowns must be omitted or replaced with only the information that player's rules allow.
- `EXPLORED` retains only authorized static memory. Do not transmit a complete world snapshot and rely on PixiJS fog to hide it: browser clients can inspect network traffic and memory.
- Spectator access requires its own explicit information policy and permission; it must not inherit either player seat accidentally. Local hotseat must clear prior-player DOM, hover data and overlays before switching perspectives.
- Validate reconnect tokens before a seat receives its latest player-specific full snapshot.

## State updates and reconnect

- Start with a fixed 10 Hz simulation tick. Send a full, versioned player-specific snapshot on join or reconnect. During play, send changed state with a `baseTick` and `tick`; if a delta base is missing, request a fresh full snapshot.
- Present input feedback locally at render speed, but do not predict combat results or unit physics. Interpolate visible positions between accepted snapshots. On a rejected action, remove the local intent cue and show the reason. Interpolation is presentation, so collisions, teleports, visibility changes and respawns may require a snap rather than a smooth transition.
- Bound outbound queues and per-client message size. If a client falls behind, coalesce pending state into a newer snapshot rather than buffering an unlimited sequence of deltas. The browser `WebSocket` API has no built-in backpressure ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)). Measure bandwidth and queue depth before fixing update rates.
- On reconnect, restore from server tick and a fresh filtered snapshot. Duplicate command sequence numbers must not replay a purchase or cast.

## Determinism and replay

- `shared/` must not read the DOM, PixiJS, network sockets, real-time clocks or unseeded randomness. Commands, initial seed, rule-data version and simulation version define a match. Use integer or fixed-point values for money, tick timers and other rules where floating-point order could change outcomes.
- For a verifiable replay, store the initial seed and accepted command log; add periodic snapshots to seek quickly and compare state hashes. A 10,000-event recent telemetry buffer can support diagnostics but cannot guarantee a full 18-minute replay. Replay UI comes after recorded matches can be replayed deterministically.
- Capture match logs on the server for online matches. Local matches can record the same format in browser storage, subject to a measured size budget.

## Acceptance checks before online release

1. A modified client cannot hire, cast, see, or command anything beyond its seat's allowed state.
2. One player's network frames never contain a hidden enemy unit, trap or private card.
3. A delayed client reconnects to the correct server tick and cannot duplicate a prior command.
4. A slow socket stays within a defined queue and memory budget and recovers through a new snapshot.
5. Two identical seed-plus-command runs produce the same state hashes at fixed checkpoints.
