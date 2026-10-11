# VOMEGA MVP — North Star (v0.5)

**Status:** Owner-defined MVP product/UX north star  
**Date:** 2026-10-11  
**Scope:** User-facing capabilities, without prescribing implementation.

This document describes what the user should be able to do. It is the reference for the MVP experience, not an assertion that those capabilities are implemented or proven. The development shell is intentionally lighter than the eventual installed Windows product.

## Core user capabilities

- **Launch:** Install VOMEGA on Windows. A floating text box opens as the primary interface.
- **Guide:** Provide contextual instructions, suggestions, and interactive setup sequences directly inside the text box.
- **Understand & Execute:** Translate natural language into deterministic commands, clarify ambiguity, and execute supported actions.
- **Workspace Setup:** During onboarding, let users select or create their master VOMEGA folder, establishing where their personal data and workspace information reside.
- **Workspace Management:** Organize user activity, prompts, configurations, history, and personal knowledge within the master workspace, with simple local storage initially.
- **Help & Wiki:** Provide contextual help and a resizable, expandable wiki, combining general VOMEGA documentation with user-specific knowledge stored in their workspace.
- **Connect:** Guide registration of ChatGPT, Claude, and Gemini, supporting multiple accounts and subscription plans.
- **Authenticate & Isolate:** Guide first-time Chrome login and maintain independent, persistent browser environments for each account.
- **Manage Browsers:** Launch, show, hide, close, and switch between registered provider browsers through commands.
- **Discover Capabilities:** Detect available models, thinking levels, conversation controls, and other supported provider features.
- **Customize Appearance:** Configure text-box dimensions, shape, borders, background, typography, text colors, and command-specific visual styling.
- **Customize Layout:** Configure the position, arrangement, visibility, and appearance of unified provider controls, selectors, buttons, and attachment features.
- **Drawers & Reveal:** Hide UI components in drawers that can appear through hover, proximity, interaction, or commands.
- **Compose & Route:** Enter prompts, attach files, select provider/account/model destinations, and independently configure supported settings.
- **Fan Out:** Send the same prompt and compatible attachments simultaneously to multiple provider accounts and models.
- **Inspect & Control:** Use commands to inspect execution, retrieve status, stop or retry supported actions, and reveal relevant browsers. No automatic monitoring dashboard.
- **Remember & Repeat:** Record prompts, commands, destinations, timestamps, attachment references, and execution events within the workspace. Search, modify, and repeat previous interactions.
- **Learn the Environment:** Automatically maintain the user's workspace wiki with account configurations, discovered capabilities, preferences, and relevant interaction history.

## Workspace principle

**User-selected VOMEGA master folder**, conceptually containing:

- Workspaces and settings
- Prompts and execution history
- Commands and events
- Personal wiki and environment knowledge

This is a conceptual organization, **not** a prescribed directory structure. Structured local files such as JSON may be sufficient initially.

## Development UI baseline — additional constraint

- **Initial Development Shell:** Instead of building the complete Windows desktop application initially, use a simple, effectively infinite 3D canvas.
- **Initial Canvas State:** The canvas is empty except for the floating text box.
- **Functional Continuity:** All MVP capabilities listed above remain in scope and are introduced progressively through the text box.
- **Expandable Surface:** Optional buttons, drawers, selectors, and wiki panels can emerge within the canvas when invoked.
- **Deferred:** Full Windows-native application packaging, desktop integration, and advanced spatial interactions.

## Foundational principles

- **User-owned workspace:** The user's data, prompts, event tracking and personal wiki live under their chosen master folder.
- **Command-complete interaction:** Every supported functional capability must be accessible through commands; graphical controls are optional, configurable ways to invoke the same functions.
- **User-directed action:** The system guides but never silently types user inputs or executes materially different actions from those presented.
- **Progressive visual disclosure:** The interface starts with a single floating text box; optional controls can be revealed, hidden, rearranged, and configured.
- **Browser-first reading:** In v1, users read the AI responses directly in the provider browser windows; automatic response ingestion and cross-provider synthesis are not MVP requirements.
- **Proof honesty:** This is desired product scope, not evidence that the current code implements it. Provider automation, retention and consent requirements remain subject to the project's applicable safety and proof gates.

**Core product promise:** A customizable, command-first floating interface that guides users, orchestrates their existing AI applications, and remembers their interactions.

**Development distinction:** The effectively infinite 3D canvas is the initial development shell, **not** a reduction in MVP functionality.
