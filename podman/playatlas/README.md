# PlayAtlas Ansible Role

This Ansible role deploys **PlayAtlas** using **Podman Quadlets**. It handles:

- Creating persistent data volumes
- Configuring container environment variables
- Setting up IPv4 and IPv6 port bindings
- Deploying a systemd service via Podman Quadlets
- Ensuring the container is started and managed automatically

## Requirements

- **Ansible 2.13+**
- **Podman** installed on the target host
- Target host must support **systemd user services** if `scope: user` is used

## Role Variables

The following variables can be configured (with defaults):

| Variable                        | Default               | Description                                                                                                          |
| ------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `playatlas_service_name`        | `playatlas`           | Name of the systemd service and Podman container                                                                     |
| `playatlas_scope`               | `user`                | Scope for systemd service (`user` or `system`)                                                                       |
| `playatlas_version`             | `latest`              | PlayAtlas container image version                                                                                    |
| `playatlas_tz`                  | `America/Sao_Paulo`   | Timezone for the container                                                                                           |
| `playatlas_log_level`           | `0`                   | Log level for PlayAtlas (`0` = debug, higher numbers = less verbose)                                                 |
| `playatlas_bind_ipv4_addresses` | `[192.168.1.10]`      | List of IPv4 addresses to bind container ports to                                                                    |
| `playatlas_bind_ipv6_addresses` | `[fd00::1]`           | List of IPv6 addresses to bind container ports to                                                                    |
| `playatlas_container_network`   | `home-server.network` | Podman network to attach the container to. **Make sure this network exists and is active** before running this role. |

## Example Playbook

**Important Note**: Avoid binding PlayAtlas to `0.0.0.0` (IPv4) or `::` (IPv6) as it'll expose the server on all interfaces, which can be a security risk, especially if your network supports IPv6. **PlayAtlas is intended for use within your LAN only and should not be publicly accessible**.

```yaml
- role: playatlas
      vars:
        playatlas_service_name: playatlas
        playatlas_scope: user
        playatlas_version: 1.0.0-beta.3
        playatlas_tz: America/Sao_Paulo
        playatlas_log_level: 0
        playatlas_bind_ipv4_addresses:
          - 192.168.10.2
        playatlas_bind_ipv6_addresses:
          - fd00::2
        playatlas_container_network: "playatlas.network"
```
