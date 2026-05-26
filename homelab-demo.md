# Homelab Inventory

> Exported 5/21/2026, 10:30:00 AM — 16 entries

---

# isp-modem

- **Type:** network
- **Tags:** network
- **IP Address:** 192.168.100.1
- **System:** Arris SBG10 Cable Modem
- **OS / Firmware:** AT_01.06.000
- **CPU:** —
- **RAM:** —
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** Network Closet — Top Shelf

## Running on this Host / Parent

- **edge-router** (network) — 10.0.0.1

## Notes

Root of the network topology. Bridge mode — all NAT and firewalling happen on edge-router.
ISP: 1 Gbit symmetric.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: ispmdm0001*

# edge-router

- **Type:** network
- **Tags:** network, security, critical
- **IP Address:** 10.0.0.1
- **System:** Protectli Vault FW6B
- **OS / Firmware:** pfSense CE 2.7.2
- **CPU:** —
- **RAM:** —
- **GPU:** —
- **Private:** false
- **Notes Private:** true
- **Location:** Network Closet — Shelf 3
- **Host:** isp-modem
- **Power Source:** ups-rack

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| Firewall | — | Stateful packet filtering with pfBlockerNG | https://www.pfsense.org/ | false |
| OpenVPN | 1194 | Remote-access VPN | — | false |
| HAProxy | 443 | SSL termination for internal services | — | false |

## Running on this Host / Parent

- **core-switch** (network) — 10.0.0.2

## Notes

VLANs: 10 LAN, 20 IoT, 30 Guest, 40 Mgmt. Outbound DNS forced to pihole-lxc on the LAN VLAN.
Inter-VLAN ACLs documented in the internal runbook — see vault-server.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: rtredge0001 | ParentID: ispmdm0001 | PowerID: upsrack0001*

# core-switch

- **Type:** network
- **Tags:** network, critical
- **IP Address:** 10.0.0.2
- **System:** UniFi USW-Pro-24-PoE
- **OS / Firmware:** 7.0.66
- **CPU:** —
- **RAM:** —
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** Network Closet — Shelf 3
- **Host:** edge-router
- **Power Source:** ups-rack

## Running on this Host / Parent

- **iot-switch** (network) — 10.0.0.3
- **proxmox-01** (server) — 10.0.1.10
- **truenas-01** (storage) — 10.0.1.50
- **unifi-ap** (network) — 10.0.0.5
- **workstation-01** (server) — 10.0.1.60

## Notes

24-port managed gigabit + 4 SFP+. PoE budget 400W — feeds the AP and the IoT switch.
LAGG to truenas-01 on ports 23/24.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: swcore0001 | ParentID: rtredge0001 | PowerID: upsrack0001*

# iot-switch

- **Type:** network
- **Tags:** network, smart-home
- **IP Address:** 10.0.0.3
- **System:** UniFi USW-Lite-8-PoE
- **OS / Firmware:** 7.0.66
- **CPU:** —
- **RAM:** —
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** Living Room — TV Console
- **Host:** core-switch
- **Power Source:** ups-rack

## Notes

Trunked to core-switch on port 8. IoT VLAN 20 only; no inter-VLAN routing.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: swiot00001 | ParentID: swcore0001 | PowerID: upsrack0001*

# unifi-ap

- **Type:** network
- **Tags:** network
- **IP Address:** 10.0.0.5
- **System:** UniFi U6-Pro
- **OS / Firmware:** 6.6.65
- **CPU:** —
- **RAM:** —
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** Hallway — Ceiling Mount
- **Host:** core-switch

## Notes

Broadcasts 3 SSIDs: Home (VLAN 10), IoT (VLAN 20), Guest (VLAN 30). PoE+ powered from core-switch.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: apunifi001 | ParentID: swcore0001*

# proxmox-01

- **Type:** server
- **Tags:** server, virtualization, critical
- **IP Address:** 10.0.1.10
- **System:** Dell OptiPlex 7080 Micro
- **OS / Firmware:** Proxmox VE 8.2
- **CPU:** Intel Core i7-10700T / 8c / 16t
- **RAM:** 64 GB DDR4 2933 MHz
- **GPU:** Intel UHD 630 (QuickSync transcoding)
- **Private:** false
- **Notes Private:** false

## Storage

| Type / Device | Size | Notes | Private |
|---------------|------|-------|---------|
| Samsung 970 EVO Plus NVMe | 500 GB | Boot drive | false |
| Samsung 980 Pro NVMe | 2 TB | VM / LXC storage pool | false |
| WD Red Plus | 4 TB | Local backups (mirrored to truenas-01 nightly) | false |

- **Location:** Network Closet — Shelf 2
- **Host:** core-switch
- **Power Source:** ups-rack

## Running on this Host / Parent

- **docker-host-vm** (vm) — 10.0.1.20
- **homeassistant-lxc** (container) — 10.0.1.40
- **media-vm** (vm) — 10.0.1.21
- **pihole-lxc** (container) — 10.0.1.53

## Notes

Primary hypervisor. PCI passthrough of the iGPU into media-vm for Plex transcoding.
Backups run nightly at 02:00 via PBS to truenas-01.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: pxmx000001 | ParentID: swcore0001 | PowerID: upsrack0001*

# docker-host-vm

- **Type:** vm
- **Tags:** virtualization
- **IP Address:** 10.0.1.20
- **System:** —
- **OS / Firmware:** Ubuntu Server 24.04 LTS
- **CPU:** 4 vCPU
- **RAM:** 16 GB
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** —
- **Host:** proxmox-01

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| Nginx Proxy Manager | 81 | Reverse proxy for everything below | https://nginxproxymanager.com/ | false |
| Portainer | 9443 | Container management UI | https://www.portainer.io/ | false |
| Vaultwarden | 8222 | Bitwarden-compatible password manager | https://github.com/dani-garcia/vaultwarden | false |
| Uptime Kuma | 3001 | Service monitoring | https://github.com/louislam/uptime-kuma | false |
| Dozzle | 9999 | Live log viewer | https://dozzle.dev/ | false |

## Running on this Host / Parent

- **nextcloud-lxc** (container) — 10.0.1.22

## Notes

Power source is inherited from proxmox-01 → ups-rack in the Power view.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: dkrvm00001 | ParentID: pxmx000001*

# media-vm

- **Type:** vm
- **Tags:** virtualization, media
- **IP Address:** 10.0.1.21
- **System:** —
- **OS / Firmware:** Ubuntu Server 24.04 LTS
- **CPU:** 4 vCPU
- **RAM:** 8 GB
- **GPU:** Intel UHD 630 (passthrough from proxmox-01)
- **Private:** false
- **Notes Private:** false
- **Location:** —
- **Host:** proxmox-01

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| Plex | 32400 | Media server with hardware transcoding | https://www.plex.tv/ | false |
| Radarr | 7878 | Movies | https://radarr.video/ | false |
| Sonarr | 8989 | TV | https://sonarr.tv/ | false |
| Prowlarr | 9696 | Indexer aggregator | https://prowlarr.com/ | false |
| Overseerr | 5055 | Public request portal | https://overseerr.dev/ | false |
| qBittorrent | 8080 | Behind Gluetun VPN | — | true |

## Notes

The qBittorrent service is marked Private so it does not appear in the public exports.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: mdavm00001 | ParentID: pxmx000001*

# nextcloud-lxc

- **Type:** container
- **Tags:** virtualization
- **IP Address:** 10.0.1.22
- **System:** —
- **OS / Firmware:** Debian 12
- **CPU:** 2 vCPU
- **RAM:** 4 GB
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** —
- **Host:** docker-host-vm

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| Nextcloud | 8443 | Personal cloud — files, calendar, contacts | https://nextcloud.com/ | false |

## Notes

Demonstrates a container nested inside a VM. In the Network topology you'll see
isp-modem → edge-router → core-switch → proxmox-01 → docker-host-vm → nextcloud-lxc
— six levels of nesting all rendered in one tree.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: nxtcld0001 | ParentID: dkrvm00001*

# pihole-lxc

- **Type:** container
- **Tags:** virtualization, dns
- **IP Address:** 10.0.1.53
- **System:** —
- **OS / Firmware:** Debian 12
- **CPU:** 1 vCPU
- **RAM:** 512 MB
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** —
- **Host:** proxmox-01

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| Pi-hole | 80 | DNS sinkhole + LAN DNS | https://pi-hole.net/ | false |
| Pi-hole Admin | 8081 | Admin UI — internal only | — | true |

## Notes

Forwards upstream to Cloudflare 1.1.1.1 and Quad9.
The Admin service is marked Private; only the public-facing Pi-hole service shows up in shared exports.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: pihole0001 | ParentID: pxmx000001*

# homeassistant-lxc

- **Type:** container
- **Tags:** virtualization, smart-home
- **IP Address:** 10.0.1.40
- **System:** —
- **OS / Firmware:** Debian 12
- **CPU:** 2 vCPU
- **RAM:** 4 GB
- **GPU:** —
- **Private:** false
- **Notes Private:** true
- **Location:** —
- **Host:** proxmox-01

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| Home Assistant | 8123 | Smart-home hub | https://www.home-assistant.io/ | false |
| Mosquitto | 1883 | MQTT broker | https://mosquitto.org/ | false |
| Z-Wave JS | 3000 | Z-Wave controller | https://zwave-js.github.io/zwave-js-ui/ | false |

## Notes

Controls 47 devices across Zigbee, Z-Wave, and Wi-Fi. ConBee II for Zigbee on USB pass-through; Zooz ZST39 for Z-Wave.
Door, window, and presence sensors mapped 1:1 to room names — full topology in the dashboard at https://home.example.lab/.
Because Notes Private is set on this entry, this entire block is omitted from public exports while the rest of the entry still appears.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: halxc00001 | ParentID: pxmx000001*

# truenas-01

- **Type:** storage
- **Tags:** storage, critical
- **IP Address:** 10.0.1.50
- **System:** Custom build — Fractal Node 304
- **OS / Firmware:** TrueNAS SCALE 24.04
- **CPU:** Intel Xeon E-2226G / 6c / 6t
- **RAM:** 32 GB ECC DDR4
- **GPU:** —
- **Private:** false
- **Notes Private:** false

## Storage

| Type / Device | Size | Notes | Private |
|---------------|------|-------|---------|
| Seagate IronWolf Pro | 8 TB × 4 | RAID-Z2 — main pool | false |
| Samsung 970 EVO Plus NVMe | 1 TB × 2 | Mirrored metadata vdev | false |
| Kingston DC600M SSD | 480 GB | Boot pool (mirrored with twin) | false |
| Encrypted USB SSD | 1 TB | Off-site recovery key escrow | true |

- **Location:** Network Closet — Shelf 1
- **Host:** core-switch
- **Power Source:** ups-rack

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| SMB / NFS Shares | 445 | LAN file shares | — | false |
| Proxmox Backup Server | 8007 | Nightly Proxmox backups | https://www.proxmox.com/en/proxmox-backup-server | false |
| Tailscale | — | Mesh VPN for off-LAN access | https://tailscale.com/ | false |

## Notes

22 TB usable after RAID-Z2 parity. SMART monitoring + email alerts via internal SMTP relay.
The encrypted USB drive row is marked Private and will not appear in public exports.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: trnas00001 | ParentID: swcore0001 | PowerID: upsrack0001*

# workstation-01

- **Type:** server
- **Tags:** server
- **IP Address:** 10.0.1.60
- **System:** Custom build — Lian Li O11 Mini
- **OS / Firmware:** Pop!_OS 22.04
- **CPU:** AMD Ryzen 9 7900X / 12c / 24t
- **RAM:** 64 GB DDR5 6000 MHz
- **GPU:** NVIDIA RTX 4070 Ti / 12 GB
- **Private:** false
- **Notes Private:** false

## Storage

| Type / Device | Size | Notes | Private |
|---------------|------|-------|---------|
| WD Black SN850X NVMe | 2 TB | OS + projects | false |
| Samsung 990 Pro NVMe | 4 TB | Datasets + model weights | false |

- **Location:** Office — Under Desk
- **Host:** core-switch
- **Power Source:** ups-workstation

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| Ollama | 11434 | Local LLM runtime — Llama 3 / Mistral | https://ollama.com/ | false |
| Stable Diffusion WebUI | 7860 | Image generation | https://github.com/AUTOMATIC1111/stable-diffusion-webui | false |
| Jupyter Lab | 8888 | Notebooks for ML experiments | https://jupyter.org/ | false |

## Notes

Daily-driver desktop that also acts as the ML / inference box. GPU is the reason a first-class GPU field exists.
Plugged into its own UPS so a flaky office circuit doesn't take down the rack.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: wrkstn0001 | ParentID: swcore0001 | PowerID: upswrkst001*

# vault-server

- **Type:** server
- **Tags:** server, security
- **IP Address:** 10.0.1.99
- **System:** Raspberry Pi 5 / 8 GB
- **OS / Firmware:** Raspberry Pi OS Lite (64-bit)
- **CPU:** Broadcom BCM2712 / 4 cores
- **RAM:** 8 GB LPDDR4X
- **GPU:** —
- **Private:** true
- **Notes Private:** false

## Storage

| Type / Device | Size | Notes | Private |
|---------------|------|-------|---------|
| Samsung T7 USB SSD | 500 GB | Secrets vault — air-gapped backups | false |

- **Location:** Safe
- **Host:** core-switch

## Services

| Service | Port | Notes | URL | Private |
|---------|------|-------|-----|---------|
| HashiCorp Vault | 8200 | Secrets storage | https://www.vaultproject.io/ | false |

## Notes

Whole entry is marked Private — it will not appear in homelab-public.md or homelab.html exports
at all. Useful for boxes you don't want to advertise externally.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: vault00001 | ParentID: swcore0001*

# ups-rack

- **Type:** ups
- **Tags:** power
- **IP Address:** —
- **System:** APC Back-UPS Pro 1500VA (BR1500MS2)
- **OS / Firmware:** —
- **CPU:** —
- **RAM:** —
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** Network Closet — Floor

## Powered devices

- **core-switch** (network)
- **edge-router** (network)
- **iot-switch** (network)
- **proxmox-01** (server)
- **truenas-01** (storage)

## Notes

1500 VA / 900 W pure sine. Connected to truenas-01 via USB for graceful shutdown.
Runtime at observed load ~22 minutes.
In the Power topology view this UPS is a root; every device above shows up as a direct child,
and the VMs and containers running on proxmox-01 are inherited under it automatically because
they don't have a power source of their own.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: upsrack0001*

# ups-workstation

- **Type:** ups
- **Tags:** power
- **IP Address:** —
- **System:** CyberPower CP1500PFCLCD
- **OS / Firmware:** —
- **CPU:** —
- **RAM:** —
- **GPU:** —
- **Private:** false
- **Notes Private:** false
- **Location:** Office — Under Desk

## Powered devices

- **workstation-01** (server)

## Notes

Office UPS, isolated from the rack so a tripped breaker upstairs doesn't take down the homelab.

---
*Created: 2026-05-21T10:30:00.000Z | Updated: 2026-05-21T10:30:00.000Z | ID: upswrkst001*
