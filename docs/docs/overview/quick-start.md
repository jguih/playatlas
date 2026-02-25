# Quick Start

Here's a quick, no-choice way to install PlayAtlas so you can try it out as soon as possible.

## Requirements

- A Linux host
- Podman
- A reverse-proxy to terminate TLS.

## Step 1: Start the Container

To deploy PlayAtlas using **Podman**, run:

```bash
podman run -d \
  --name playatlas \
  -v playatlas-data:/app/data \
  -e TZ=America/Sao_Paulo \
  -e PLAYATLAS_LOG_LEVEL=0 \
  -p 127.0.0.1:3000:3000 \
  docker.io/library/playatlas
```

By default, the container is bound to `127.0.0.1`, meaning it is only accessible from the host machine.

If you intend to access PlayAtlas from another device on your LAN (or from your Playnite host, for the PlayAtlas Exporter to be able to communicate with the server, for example), replace 127.0.0.1 with the server's private IPv4 or IPv6 address. For example:

```bash
-p 192.168.1.10:3000:3000
```

**Important: Explicit Interface Binding**

Do not expose PlayAtlas using `-p 3000:3000` without specifying an address.
Doing so will bind the service to all network interfaces (0.0.0.0), potentially exposing it beyond your intended trust boundary.

**PlayAtlas is designed to operate within a controlled LAN environment** and may allow remote extension-triggered operations on your Playnite host. Binding explicitly ensures you maintain that boundary.

## Step 2: Configure HTTPS (Required)

When PlayAtlas is accessed from another device on your LAN, HTTPS is required.

Modern browsers restrict certain APIs (including Web Crypto APIs used by PlayAtlas) to secure contexts. Accessing the application via plain HTTP on a LAN IP (e.g., `http://192.168.x.x`) will cause runtime errors.

The recommended approach is to use a reverse proxy.

### Example: Caddy

Below is a minimal `Caddyfile` example:

```caddyfile
playatlas.local {
  reverse_proxy 192.168.1.10:3000
}
```
