# Aurolith build process

**2026-10-26 requirement audit:** Added a DEV-only positioned Outrider encounter and repeatable browser check through real simulation emission, projection and Canvas ring drawing. Own alert expands at the correct coordinate and expires; opponent-only event produces no ring. Targeted browser and production build/type checking pass. [Audit and captures](stage2-gate-audit-2026-10-26.md).


**2026-10-26 late-game continuation:** Completed ordinary-HUD defensive scenario through active 15:00 overtime to the 18:00 wall-damage result without page errors. Added facility category counters and invalid-build explanations after a failed scenario exposed the misleading button state. Build/type checking passes. [Evidence and current remaining gate](stage2-late-game-2026-10-26.md).


**Latest HUD/readability verification (2026-10-26):** User confirmed functional usability but did not assess balance and found skill/stun effects unclear. Character-art battlefield markers and explicit status/cast labels are implemented. Final build/type checking, expanded HUD smoke, 100% event-driven effects and full UI scenarios pass. Attacking runs win at 7:50/7:47; unattended local-player defeat at 11:09 uses correct own-Core wording; restart works. The former HUD interaction follow-up is complete. Human review of the new cues and S2-6 strategy/balance/timed pacing remain open. [Full continuation record](stage2-readability-and-hud-2026-10-26.md).

**Latest revision (2026-10-26):** Jungle access roads now stop at the forest entrance on the battlefield side, including their shoulders. Full suite **171/171 across 17 files**, build/type checking and browser overview capture pass after this revision. The user reports most functions are usable; exact S2-6 match/checkpoint evidence remains open. [Current road notes](stage2-jungle-access-paths.md).

**Goal:** ship the PC browser RTS/deckbuilder selected in the 2026-10-19 session titled "Choose a platform for Aurolith", with solo play, online 1v1, the full content catalog, replay and a stable release. Stage 2 targets a complete local browser match; online server delivery comes later. The [technical roadmap](../TechnicalPlan/14%20-%20Implementation%20Roadmap,%20Authority%20%26%20Decision%20Log.md) defines architecture and rule authority; these stage files define the work sequence.

**Current work (2026-10-25):** Stage 2 remains incomplete. S2-1 through S2-5 have recorded acceptance for defined scope; S2-6 awaits human game-feel and pacing evidence. The UI now uses a right control rail and floating `P` help (`O` pause); five painted PNG ground materials are integrated. Latest build and five-region 100% terrain captures passed on 2026-10-25. Latest full simulation suite was 164/164 across 16 files on 2026-10-24, before the new HUD/art changes. Post-layout control interactions still need a smoke pass; open collapsed groups in the script before clicking their controls. The client at `http://127.0.0.1:5173/` returned HTTP 200 for this handoff and is left running. Read the [latest session handoff](stage2-session-handoff-2026-10-25.md), [acceptance log](stage2-acceptance-log.md), and [playtest sheet](stage2-human-playtest.md). Keep S2-6 and the Stage 2 exit open until their evidence is reviewed.

The machine-readable Stage 1 rule inventory is [`shared/src/rule-inventory.ts`](../../shared/src/rule-inventory.ts). Entries labeled `fixture` are temporary playtest behavior; every canonical entry points to a rule source.

**Latest continuation (2026-10-25):** The user reported positive UI/function feedback and chose faster jungle access instead of a larger map. Four mirrored front-gate branches now connect both fortresses to both jungle flanks. Implemented the canonical +10% highway movement bonus and matching travel-cost-aware A*. Latest full suite is **171/171 across 17 files**, and the build plus five-region terrain captures pass after this change. These supersede the earlier simulation/build/capture checkpoints above. [Current change record](stage2-jungle-access-paths.md). S2-6 remains open for exact human match and timed observations.

## How we work together

You own game feel, theme, priorities and unresolved rule choices. I turn each chosen feature into a small ticket, implement it, run checks, and give you a playable build or concrete screenshots. Your feedback becomes the next ticket when you choose to play or review. I maintain the rules, code, test fixtures, asset inventory and decision log, and run the solo, browser and two-client verification. A stage closes when its stated exit check passes, with known defects tracked explicitly.

For every ticket: **read canonical rule â†’ state expected player behavior â†’ implement the smallest complete path â†’ run focused checks â†’ play it â†’ record result and next change.** Keep a running build at all times. Each stage file has specific tasks and an exit check; only work on later-stage features early if they remove a measured blocker.

| Stage | Process file | Result |
|---|---|---|
| 0 | [Rules and foundation](stage-0-rules-and-foundation.md) | Clear rule baseline, data IDs, working project skeleton. |
| 1 | [Playable vertical slice](stage-1-playable-slice.md) | One short local match proving the core loop. |
| 2 | [Complete match systems](stage-2-complete-match.md) | Full 18-minute solo match with a validated content subset. |
| 3 | [Full content and balance](stage-3-content-and-balance.md) | Complete catalogs, assets and representative balance checks. |
| 4 | [Online 1v1](stage-4-online-1v1.md) | Fair, reconnectable two-player match. |
| 5 | [Replay and polish](stage-5-replay-and-polish.md) | Replay, accessibility, performance and regression gates. |
| 6 | [Release and support](stage-6-release-and-support.md) | Public browser release with verified recovery and patch process. |

## Decisions to make when they become relevant

- **Resolved for Stage 0:** five free starter units with 0 starting gold; core HP then draw for exact 18:00 wall-damage ties; variant-tier monster HP; green/yellow/red ground-health palette; explicit Goddess condition grants with at most one copy of each named Divine item. See the conflict ledger below for Jev judgments and source changes.
- **Later creative review:** starter portraits and roster feel, plus gameplay balance after a playable match. This review can revise a rule explicitly; it does not block the deterministic foundation.

The [conflict ledger](../TechnicalPlan/14%20-%20Implementation%20Roadmap,%20Authority%20%26%20Decision%20Log.md#source-rule-conflicts-resolved-for-the-stage-0-baseline) has the source references. Decisions are recorded in the relevant canonical rule file and then reflected in implementation; they are not silently invented in code.

## Completion rule

The game is complete when a fresh player can open the deployed build, finish a solo match and an online 1v1 match, understand the result, and replay a match; the full content catalog is accessible under its intended rules; the release checks in Stage 6 pass. A successful build command alone does not close a stage.

### Why this order

Jev selected stage exit gates (**yes, 62%**), deciding open rules when their dependent system is due (**yes, 60%**), early local playtesting (**yes, 72%**), completing match systems with a small content subset before importing all content (**yes, 83%**), online play after the validated local game (**yes, 84%**), agent-run verification with you focused on creative choices (**yes, 75%**), release checks across solo, online and replay (**yes, 69%**), and a separate release stage (**yes, 91%**). These percentages are Jev's confidence in the sequence judgments, not estimates of completion probability.

