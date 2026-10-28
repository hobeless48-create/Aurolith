# Stage 6 — Release and early support

**Outcome:** Aurolith is available at its chosen browser address, and a broken deployment or match can be diagnosed and repaired.

## Tasks

- [ ] **S6-1 — Prepare the release package.** Pin dependency and content versions, build static client assets, configure the server, domain, HTTPS and backups of match logs/configuration. **Verify:** a fresh deployment from the release revision starts without local development files.
- [ ] **S6-2 — Run pre-release checks.** Test loading, asset fetches, audio start, solo mode, online join, reconnect, result and replay against the release candidate. **Verify:** each has a recorded pass result on the deployment, not only on a developer machine.
- [ ] **S6-3 — Publish and smoke-test.** Release the approved build to the chosen browser host and repeat the shortest solo and online paths. **Verify:** players outside the development machine can finish both match types.
- [ ] **S6-4 — Watch the first sessions.** Check server errors, disconnect/reconnect rate, failed commands, loading failures and player reports. **Verify:** each material failure has a reproducible case, owner and severity.
- [ ] **S6-5 — Patch and preserve state.** Fix release blockers, rerun affected rule/replay tests, and keep a way to return to the previous working build. **Verify:** the patch resolves its issue and does not change match rules without a new rule/data version.

## Your input

Choose the public name/URL, distribution and launch timing. Review the release candidate and player-facing text. Deployment occurs when you authorize the concrete release build and destination.

## Exit check

The public build passes solo and online smoke tests, replay opens, failures are observable, and the first serious player reports have been triaged or fixed.
