# PlayAtlas Packages

## Overview

PlayAtlas is structured as a **modular, domain-driven system** using CQRS and explicit composition.
Each package represents a **bounded context** or a supporting layer with clear responsibilities and boundaries.

```
@playatlas
├── auth/ # Authentication and identity domain
├── bootstrap/ # Application composition layer
├── game-library/ # Game metadata (titles, playtime, tags, media)
├── game-note/ # Game notes and journaling domain
├── game-session/ # Game session tracking (open/close, duration)
├── playnite-integration/ # Playnite adapter and synchronization layer
├── common/ # Cross-domain utilities, shared types, and contracts
└── system/ # Infrastructure (db, fs, logging, runtime concerns)
```

## Architectural Principles

This project follows **DDD-inspired architecture** with pragmatic CQRS.
The goal is **clarity, correctness, and long-term maintainability**, not dogma.

### Core principles

- Explicit domain boundaries
- Clear separation between **commands** and **queries**
- Domain logic lives in entities and domain services
- Infrastructure details are isolated
- Behavior is tested through public APIs, not internals

## Command–Query Responsibility Segregation (CQRS)

### Commands

- Represent **intent to change state**
- Always go through **command handlers**
- Return **explicit result objects**
- Never return domain entities
- Never expose repositories directly
- Do not rely on exceptions for expected control flow

Command results always describe:

- whether the command succeeded
- _why_ it succeeded or failed

### Queries

- Represent **read-only access**
- Return **DTOs**, not domain entities
- May include caching or ETag semantics
- Are safe and idempotent

## Reason Codes and Explicit Outcomes

All command handlers return **reason codes** that explain _why_ a decision was made.

Reason codes are:

- stable
- machine-readable
- safe to depend on (UI, events, tests)

They express **business meaning**, not technical failure.

### Good examples

- extension_registration_approved
- extension_registration_already_approved
- cannot_approve_rejected_registration
- not_found

A reason code should answer:
“Why did the system choose this outcome?”

## Layered Validation Philosophy

PlayAtlas intentionally applies **multiple layers of validation**.
This is not accidental redundancy — each layer serves a distinct purpose.

### 1. Command Handler Validation (Business Policy)

Command handlers:

- Decide **whether a command should succeed**
- Return explicit success, reason_code, and reason
- Model expected business outcomes
- Do **not** throw for expected failures

### 2. Domain Entity Invariant Protection

Domain entities:

- Enforce **invariants**
- Protect against invalid state transitions
- Throw exceptions when invariants are violated

### 3. Repository Validation (Persistence Safety)

Repositories:

- Validate entities before persistence
- Ensure internal consistency
- Act as a final safety net before writing data

## Testing Philosophy

Tests are written against **public application APIs**, never against repositories or entities directly.

Tests should:

- execute commands and queries exactly like production
- assert on results and emitted domain events
- avoid mocking domain behavior

## Shared Types (@playatlas/common)

The common package contains:

- shared contracts
- cross-domain value types
- domain event interfaces
- identifiers shared across bounded contexts

Only **stable, domain-agnostic concepts** belong here.

Example:

```ts
export type ExtensionRegistrationId = number;
```

## Final Note

This architecture favors:

- explicit outcomes
- defensive domain modeling
- observable behavior

When in doubt: preserve invariants, explicit outcomes, and domain clarity.
