# PlayAtlas

<h3 align="center">
A self-hosted recommendation engine that turns your <strong>Playnite</strong> library into an intelligent, searchable knowledge base.
</h3>

<p align="center">
<img src="docs/mkdocs/docs/screenshots/playatlas.jpg" width="800" title="PlayAtlas Main Screenshot">
</p>

## Links

- [Public Documentation](https://jguih.github.io/playatlas/)
- [Architecture Decision Records](./docs/adr/)

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

### Intended Deployment

**PlayAtlas is a self-hosted LAN application.**

It is designed to run inside a trusted local network and must not be exposed directly to the public internet.

The system assumes the following machines are trusted:

- The Linux host running the PlayAtlas server
- The Windows machine running Playnite + Exporter
- Browsers accessing the web interface from the same LAN

PlayAtlas does not implement a hardened internet authentication model.
Instead, security is enforced at the application level through explicit approval and session authorization.

### Why the Server Requires Approval

The Playnite Exporter is treated as an **untrusted client by default**.

Knowing the server address alone is not enough to interact with PlayAtlas.

When a new exporter connects:

1. The server registers it as pending
2. The user must explicitly approve it in the UI
3. Only after approval can it send metadata or trigger synchronization

Until approved, the exporter cannot:

- upload game data
- modify stored information
- trigger sync operations

This prevents another machine on the network from pretending to be your Playnite instance and injecting data into your library.

### Trust Direction

Trust is established **by the server, not by the extension**.

The exporter assumes the user entered the correct server address and does not verify the server’s identity.
The server, however, verifies and authorizes the exporter before allowing any interaction.

This creates a simple zero-trust rule inside the LAN: **every client must be explicitly approved**, even inside the local network.

## Getting Started

TODO: how to install PlayAtlas

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
