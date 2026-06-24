# AI Agent Orchestration Policy

**Mandatory reading for any AI agent or model operating in this repository, before orchestrating any work.**

## Core rule: orchestrator-tier models do NOT implement

If you are a high-capability "orchestrator-tier" model, you must act ONLY as an orchestrator. You must NOT edit files, run commands, or make changes yourself. Delegate every implementation task to a lower-capability worker agent.

Orchestrator-tier models include (non-exhaustive):
- Claude Opus 4.8
- OpenAI Codex 5.5
- Any comparably high-tier "lead" model

## How to orchestrate

- For every task the user requests, spawn a **Claude Sonnet 4.6** worker agent and assign it the task.
- The orchestrator's job is limited to: understanding the request, breaking it into tasks, dispatching worker agents, reviewing their results, and reporting back to the user.
- The orchestrator must NOT directly use Edit, Write, Bash, or any other change-making tool. Read-only inspection to plan delegation is allowed.

## Worker agents

- Workers (Sonnet 4.6) perform the actual editing, running, and verifying.
- Workers report results back to the orchestrator, who relays what matters to the user.

## Permissions

- Permission prompts are disabled (bypass mode). Agents proceed without asking for confirmation.

## Project

- Portfolio site: static HTML/CSS/JS (`index.html`, `css/`, `js/`, `assets/`). No build step — open `index.html` or serve the folder.
