# PlayAtlas

<h3 align="center">
A self-hosted recommendation engine that turns your <strong>Playnite</strong> library into an intelligent, searchable knowledge base.
</h3>

<p align="center">
<img src="docs/docs/screenshots/playatlas.jpg" width="800" title="PlayAtlas Main Screenshot">
</p>

## Introduction

**PlayAtlas** is a self-hosted recommendation and classification engine designed to operate on top of a **Playnite**-managed gaming library.

It introduces a deterministic, versioned scoring system that evaluates games across multiple structural dimensions (e.g., Roguelike intensity, Survival mechanics, Narrative focus), transforming a static collection into an explainable, queryable knowledge space.

The system runs entirely within the user’s local network and does not depend on any third-party services.

## Motivation

Modern storefronts are highly optimized for acquisition-driven discovery. They excel at recommending games you don’t yet own.

But a different question often goes unanswered:

> From the 1,000+ games I already own, what should I play next?

[**Playnite**](https://playnite.link/) already solves the hardest problem: aggregating and normalizing a user’s distributed game libraries into a single, unified source of truth.

**PlayAtlas** builds on top of that foundation, introducing a deterministic, **multi-dimensional classification engine** that transforms a static library into a structured space of **explainable genre** intensity and structural patterns.

Instead of recommending what to buy, **PlayAtlas helps users rediscover what they already have**.

It does so without relying on external services, opaque algorithms, or cloud infrastructure.

## Getting Started

TODO: how to install PlayAtlas

## System Overview

PlayAtlas consists of three components operating within the same local network:

- **Playnite Host**: The user’s gaming machine running Playnite with the **PlayAtlas Exporter** extension.
- **PlayAtlas Server**: A self-hosted Web server responsible for maintaining your game library from Playnite, classifying games using deterministic and explainable scoring engines, optimizing Playnite media for web view, keeping track of the user's game sessions, and much more.
- **Web Client**: A browser-based interface accessible from desktop or mobile devices.

The Playnite Exporter extension synchronizes the user's game library with the PlayAtlas web server. Through the Web interface exposed by said server, the user can access their Playnite game library from any browser, anywhere, even when offline.

All communication occurs over HTTP within the user’s LAN.

## Application Architecture

### Scoring Engine Architecture

A **score engine** is a modular component responsible for computing classification scores for games and producing a structured breakdown that explains how the score was derived.

Each classification (e.g., _Horror_, _RPG_, _Survival_) has its own independent score engine. Engines are versioned, deterministic, and designed to evolve safely over time while preserving historical data.

To learn more about the internals of score engines and how to create new ones, visit [Scoring Engine Architecture](/packages/@playatlas/game-library/src/application/scoring-engine/)

## Security Model

### Trust Boundary

PlayAtlas is designed to operate inside a controlled LAN environment.

It assumes:
- The Linux host running PlayAtlas is trusted.
- The Windows host running Playnite + Exporter is trusted.
- LAN clients accessing the Web UI are trusted.
- The application is not directly exposed to the public internet.

PlayAtlas is not designed to be internet-facing.

### Exporter Trust Model

PlayAtlas enforces a strict trust boundary between the Playnite extension and the server. The server does not assume that any connecting extension is legitimate. **Initial registration requests are treated as untrusted** and **require explicit user approval** before the extension is granted access. Until approved, the extension cannot submit metadata, trigger synchronization, or interact with persistent state. This ensures that knowledge of the server endpoint alone is insufficient to gain access, preventing unauthorized clients from injecting or modifying data.

From the extension’s perspective, configuration of the server address constitutes an initial trust assumption. The extension has no built-in mechanism to verify the authenticity of the remote endpoint and therefore assumes the user-provided address is correct. However, all interactions remains gated by the server’s authorization workflow. Trust is established explicitly at the application layer rather than implicitly at the network layer, reflecting a zero-trust design appropriate for self-hosted deployments.

## Development Setup

### Local Development Server

To start the local development server, run:

```bash
pnpm dev
```

Then, open a browser and navigate to **http://localhost:3001**.

### Building Container Image

To build the Svelte application container image, run the following command at the project's root:

```bash
docker build --tag playatlas:latest --target prod .
```

### Running Production Container

If you want to run a local Podman container to test the final image, transfer it from Docker to the Podman local registry:

```bash
docker save playatlas | podman load
```

You can deploy the container using the example Ansible role at `podman/playatlas`.

Alternatively, you may use this Podman Run command:

```bash
podman run -d \
  --name playatlas \
  -v playatlas-data:/app/data \
  -e TZ=America/Sao_Paulo \
  -e PLAYATLAS_LOG_LEVEL=0 \
  -p 127.0.0.1:3000:3000/tcp \
  -p 127.0.0.1:3000:3000/udp \
  docker.io/library/playatlas
```

### Running Tests

To run all unit and integration tests:

```bash
pnpm test
```

To run all unit tests:

```bash
pnpm test:unit
```

To run all integration tests:

```bash
pnpm test:integration
```
