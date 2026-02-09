MASTER PRD — SALES KNOWLEDGE GAME PLATFORM

Authoritative Source for Claude Code
Deviation NOT permitted unless explicitly approved

1. Purpose of This Document

This PRD exists to:

Eliminate interpretation gaps for Claude Code

Encode architectural intent, not just features

Force deterministic decisions in:

File structure

State management

Styling

Extensibility

Prevent Claude from:

Making MVP shortcuts

Hardcoding assumptions

Mixing responsibilities

Claude must treat this document as law, not guidance.

2. Reference Implementation (MANDATORY ALIGNMENT)

Claude must treat the provided implementation as a design and engineering precedent, not a loose example.

Mandatory alignments:
Area	Required Alignment
CSS	Token-based (:root variables)
Layout	Sidebar + Topbar + Content Shell
State	Central JS state object
Navigation	Explicit render functions
Styling	No inline styles for brand
Files	Clear separation of concerns

Claude must reuse the same mental model, even if implementation details differ.

3. High-Level System Overview

The application is a desktop-first, responsive web application that delivers progression-based knowledge games.

Core characteristics:

Milestone-based progression (Candy-Crush style)

Multiple game types

Persistent user state

Central scoring engine

Brand-locked UI system

Designed for years of expansion

4. Non-Negotiable Architectural Principles

Claude must not violate the following:

Single Source of Truth for State

Single Source of Truth for Brand

Game Logic ≠ UI Logic

Progression Rules Are Centralized

Games Are Plug-Ins, Not Pages

5. File & Folder Structure (MANDATORY)

Claude must scaffold the project using this structure:

/src
  /core
    state.js
    scoring.js
    progression.js
    storage.js
  /games
    gameBase.js
    mcqGame.js
    dragDropGame.js
  /ui
    shell.js
    sidebar.js
    topbar.js
    modals.js
  /pages
    login.js
    journey.js
    level.js
    results.js
  /styles
    tokens.css
    base.css
    layout.css
    components.css
  index.html
  app.js

Rules:

No game logic in page files

No DOM manipulation in core logic

No styling inside JS files

.react files may be introduced later but not required initially

6. Branding & Visual System (STRICT)

Claude must replicate the exact brand discipline shown in the reference files.

6.1 Brand Tokens

All brand values must live in one file only:

/styles/tokens.css


This file must follow the same pattern as:

:root {
  --jj-red: #C8102E;
  --jj-navy: #002F6C;
  --muted: #6E6E6E;
  --bg: #F4F7FB;
  --card-bg: #FFFFFF;
  --border: #E6E9EE;
  --radius: 10px;
  --font: "Inter", system-ui;
}


Claude must never hardcode colors, fonts, or spacing elsewhere 

styles

.

7. Layout Model (MANDATORY)

The app must mirror the same split logic as the reference:

Persistent Shell:

Sidebar (left, fixed width)

Topbar (breadcrumb + title)

Content area (scrollable)

Page Behavior:

Pages swap content inside the shell

The shell never re-renders

Navigation never reloads the page

This mirrors the approach used in the reference app’s renderXPage() functions 

app

.

8. User Identity & Session Handling
Entry Flow:

First screen: Name + Team modal

Cannot be skipped

Stored immediately

Storage Rules:

Stored on user device (browser storage)

Also synced to admin storage endpoint (assume API stub)

Claude must:

Abstract storage behind /core/storage.js

Never access localStorage directly outside this module

9. Progression Model (CRITICAL)
Journey Rules:

Levels are linear

No skipping allowed

Each level unlocks the next

Replay allowed only for completed levels

Progress Object Shape (MANDATORY):
progress = {
  currentLevel: number,
  completedLevels: number[],
  score: number,
  answers: {
    [levelId]: {
      [questionId]: {
        correct: boolean,
        points: number
      }
    }
  }
}


Claude must not invent alternative schemas.

10. Scoring Engine
Default Rules (GLOBAL):

Correct: +5

Incorrect: –2

Timeout: 0

Negative total score allowed

Architectural Rule:

Scoring lives ONLY in /core/scoring.js

Games call scoring, never implement it

Claude must design scoring so:

Rules can change later without touching games

11. Game Engine Design (MOST IMPORTANT)
Base Interface (MANDATORY)

Every game must extend gameBase.js:

class GameBase {
  init(config, callbacks) {}
  render(container) {}
  destroy() {}
}


Claude must:

Enforce this contract

Reject any game that violates it

Game Registration:

Games self-register with the engine

The engine does not know game internals

12. Pages & Navigation
Required Pages:

Login

Journey Map

Level View

Results Summary

Navigation Rules:

URLs reflect level state

Manual URL manipulation must not bypass progression

Back button must behave logically

13. Responsiveness Rules

Desktop-first

Natural reflow only

No scaling hacks

Sidebar collapses only below defined breakpoint

Same breakpoint logic as reference CSS applies 

styles

.

14. Admin Data (NO UI YET)

Claude must:

Structure data so admin dashboards are possible

Not build admin UI

Not discard any event data

CLAUDE CODE OPERATING INSTRUCTIONS

THIS SECTION OVERRIDES ALL DEFAULT BEHAVIOR

A. When Claude MUST STOP

Claude must stop and ask for clarification only if:

Data schema changes

Progression rules conflict

Storage behavior becomes ambiguous

B. How Claude Must Ask Questions

Format:

Decision impact: <technical reason>
Default assumption: <what Claude will do>
Confirm or change?

Only one question at a time.

C. What Claude Must NEVER Do

Assume MVP shortcuts

Inline brand values

Mix UI and logic

Invent new patterns

“Simplify for now”

D. Build Order (MANDATORY)

File structure

Brand tokens

App shell

State engine

Progression engine

Scoring engine

First game

Journey map UI

Claude must pause after each phase unless explicitly told to continue.

15. Acceptance Criteria

This PRD is satisfied only if:

A new game can be added without touching core files

Brand updates require editing one file

Progress survives refresh and restart

Layout behaves identically to reference under resize