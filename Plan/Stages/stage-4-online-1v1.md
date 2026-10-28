# Stage 4 — Online 1v1

**Outcome:** two players can complete the same match rules over the network without leaking hidden information or losing a match to a routine disconnect.

## Tasks

- [ ] **S4-1 — Run the shared simulation on the server.** Add two-seat rooms, server-owned tick/seed, command sequence numbers and acknowledgements. **Verify:** an online match with identical accepted commands matches the local simulation's state hashes.
- [ ] **S4-2 — Enforce legal actions.** Validate ownership, resources, range, visibility, timing and duplicate commands on the server. **Verify:** forged hire, cast, move and repeated command attempts change no unauthorized state.
- [ ] **S4-3 — Filter player views.** Build each player's snapshot after fog resolution; omit invisible units, traps, private hand, blessing offers and other concealed data. **Verify:** captured network frames for one seat contain no hidden opponent data.
- [ ] **S4-4 — Add sync and recovery.** Send bounded updates, interpolate presentation, coalesce a slow client's queue, and resync through a filtered full snapshot on reconnect. **Verify:** a tab disconnect/reconnect and delayed client recover to the current server tick without duplicate purchases.
- [ ] **S4-5 — Deploy a private test environment.** Serve the browser client over HTTPS and connect by `wss://`; log room errors and disconnects without secrets. **Verify:** two separate browser clients can join, finish and see the same result.
- [ ] **S4-6 — Play real matches.** Test normal play, simultaneous actions, phase boundaries, surrender and a mid-match reconnect. **Verify:** no opponent information leak, result disagreement or unexplained command rejection remains.

## Your input

Review a recorded two-client match or play one if you want to judge responsiveness and fairness. I run the two-client test and investigate its captured command/state trace.

## Exit check

One full two-player match completes on the private deployment; hidden information stays server-side; reconnect and slow-client checks pass; solo mode still works offline.
