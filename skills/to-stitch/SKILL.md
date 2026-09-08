---
name: to-stitch
description: Turn a spec or the current conversation into paste-ready Google Stitch prompts, one per screen, using the project's existing Stitch design system.
argument-hint: "What spec/issue should be designed?"
disable-model-invocation: true
---

# To Stitch

Turn a spec, issue, or conversation into **paste-ready** prompts for [Google Stitch](https://stitch.withgoogle.com). The human pastes them into Stitch.

Do not interview the feature again. Synthesize screens from what is already decided. Use the project's domain glossary throughout.

A **screen** is a distinct UI surface: a route, a modal, a sheet, or an alert that covers the current view. A **state** is the same surface with different data or a one-line error. States belong in the spec mocks; they are not extra screens.

## Process

### 1. Gather context

Work from the conversation. If the user passed a spec path, issue number, or URL, fetch it and read the full body (and comments). Follow spec links to the matching design record and any ADRs in the area.

Done when the source's user-visible behaviour, out-of-scope surfaces, and named controls are in view.

### 2. Inventory screens and states

List every user-visible surface the source includes. Classify each as a **screen** or a **state** of a named parent. Pull labels and actions from the source.

Default device: portrait iOS/Android phone, matching this Expo app. Follow the source if it names another.

Done when every surface in the source is on the list, classified, with its job and named controls.

### 3. Quiz the user

Present the list. For each screen: title, kind (full / modal / sheet / alert), job, key controls. Group states under their parent.

Ask: missing screens? any to merge? which states to mock?

Iterate until the user approves the list. Done on that approval.

### 4. Write the prompts

One prompt per approved screen, then one per approved state. Each prompt is a single Stitch **Add screen** paste, following [Prompt craft](#prompt-craft).

Write them to `docs/design/<id>-<slug>-stitch.md` when the source has that numbering (`docs/specs/0002-login.md` → `docs/design/0002-login-stitch.md`); otherwise `docs/design/<slug>-stitch.md`. Use the file template below. Also paste each prompt in the reply as its own fenced block.

Done when the file exists, every approved screen and state has a prompt, and the reply is paste-ready. Stop there: the human generates in Stitch, then adds mocks to the spec.

<file-template>

# Stitch prompts: <feature>

Source: path or issue URL.

Paste each block into [Google Stitch](https://stitch.withgoogle.com) as one **Add screen**. The project design system is already active. Generate full screens first, then overlays, then states. After Stitch returns art, add it to the spec.

## 1. <Screen title> (screen)

A fenced block containing only the prompt.

## <Parent> — <state name> (state of 1)

A fenced block containing only the prompt.

</file-template>

## Prompt craft

Open every prompt with: use this project's existing design system and DESIGN.md; match screens already in the project; do not invent a new palette, type, radius, or component style.

Then, in this order: **anatomy** (layout, nav, what sits where), **content** (exact copy, labels, sample data), **controls** (every button, field, and link that appears). Stitch draws only what the prompt names.

Fill sample data (a real-looking URL, a username). Overlays sit on a dimmed parent screen from this project. A state prompt starts from the parent screen and names only what changes.

Close with the device: one portrait mobile phone, native app, status bar and home indicator accounted for.
