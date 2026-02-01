# Development Setup

## Building Container Locally

To build the Svelte application container, run the following command at the project's root:

```bash
docker build --tag playatlas:latest --target prod .
```

If you want to run a local Podman container to test the final image, transfer it from Docker to the Podman local registry:

```bash
docker save playatlas | podman load
```
