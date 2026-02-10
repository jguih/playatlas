# Scoring Engine Architecture

## Overview

A **score engine** is a modular component responsible for computing classification scores for games and producing a structured breakdown that explains how the score was derived.

Each classification (e.g., _Horror_, _RPG_, _Survival_) has its own independent score engine. Engines are versioned, deterministic, and designed to evolve safely over time while preserving historical data.

The scoring system is built around the following principles:

- **Determinism**: the same input must always produce the same score and breakdown
- **Versioning**: every engine has an explicit version
- **Immutability of history**: past scores are never overwritten
- **Graceful evolution**: schema changes must not break historical data
- **Separation of concerns**: extraction, policy, and serialization are independent

## Core Responsibilities

A score engine is responsible for:

1. **Extracting evidence**
   - Reads game metadata and derives structured signals

2. **Applying scoring policy**
   - Converts evidence into a numeric score and breakdown

3. **Serializing breakdowns**
   - Converts breakdowns to JSON for storage and transport

4. **Deserializing breakdowns**
   - Reads stored JSON and returns a safe representation
   - Must tolerate older or unknown schema versions

5. **Version reporting**
   - Exposes a static engine version

## Engine Contract

Each score engine implements a shared interface:

- `id` — the classification identifier
- `version` — engine version string
- `score(input)` — computes score and breakdown
- `serializeBreakdown(breakdown)` — JSON serialization

The engine must be:

- **Pure** — no hidden side effects
- **Stateless** — behavior depends only on input

## Important Rules

### 1. Engines are versioned and immutable

When scoring logic changes:

- Increment the engine version
- Do **not** modify historical records (Create new classification entries instead)

### 2. Deserialization must never throw

Breakdown deserialization must:

- Attempt strict parsing for known versions
- Fall back to a safe generic representation

This guarantees that historical data remains readable even after schema changes.

### 3. Scoring is append-only

When a score changes:

- A new record is created
- Old records are preserved
- History is cleaned up via soft deletion policies

### 4. Engines are independent modules

Each engine is self-contained and should **not** depend on other engines.

Shared utilities must live in common packages.

### 5. Registry is the single source of truth

All engines are registered in a central registry that:

- Maps classification IDs to engines
- Provides lookup during scoring and serialization

No engine should be instantiated ad-hoc outside the registry.

## Scoring Flow

The high-level scoring pipeline is:

```
Game → Evidence Extraction → Scoring Policy
     → Score + Breakdown → Serialization → Storage
```

When reading:

```
Stored JSON → Breakdown Deserialization → Public DTO
```

Breakdown deserialization is handled by a separate service called Score Breakdown Normalizer, referred internally by the interface `IScoreBreakdownNormalizerPort`.

## Directory Structure

Each engine lives under:

```
/game-library/application/scoring-engine/<engine-name>
```

Example (Horror engine):

```
horror/
├── horror.evidence-extractor.ts
├── horror.language.registry.ts
├── horror.policy.ts
├── horror.score-engine.meta.ts
├── horror.score-engine.ts
├── index.ts
└── signals/
    ├── canonical.signals.ts
    └── en.signals.ts
```

## How to Add a New Engine

To add a new classification engine:

### 1. Create engine directory

```
/scoring-engine/<new-engine>/
```

Follow the same structure as existing engines.

### 2. Implement required components

- Evidence extractor
- Scoring policy
- Engine metadata
- Score engine implementation
- Signals and language registry
- Public index export

### 3. Define engine metadata

Create a stable:

- Classification ID (Must be unique)
- Engine version

### 4. Register the engine

Add the engine to:

- The engine registry's engines internal map
- The Game library module in the `boostrap` module

This step makes the engine discoverable by the system.

### 5. Add default classification entry

Include the new classification in default seed data so it is created automatically.

### 6. Write integration tests

At minimum:

- Score computation test
- Score breakdown serialization/deserialization test
- Version upgrade reconciliation test

### 7. Verify reconciliation behavior

Ensure that:

- Engine version changes trigger rescore
- Existing history remains intact
- New records are appended correctly

## Design Goals

The scoring engine architecture is designed to:

- Support long-term evolution without breaking clients
- Preserve historical score data
- Enable independent development of engines
- Keep scoring deterministic and testable
- Allow safe schema migration

## Summary

A score engine is a versioned, deterministic module that transforms game metadata into structured classification scores. Engines evolve over time without breaking history, and the system guarantees safe reading of old data through tolerant deserialization.

New engines must follow the established directory structure and registration workflow to maintain consistency across the system.
