# homelab-backend

Express + SQLite backend for homelab.md.

## Quick Start

1. Copy `.env.example` to `.env` (optional).
2. Install dependencies:
   - `npm install`
3. Start in dev mode:
   - `npm run dev`

Server defaults to `http://localhost:3001`.

## Scripts

- `npm run dev` - start with nodemon
- `npm start` - start with node
- `npm run db:migrate` - create/update SQLite schema
- `npm run db:reset` - delete DB file and recreate schema

## API

- `GET /api/health`
- `GET /api/entries`
- `GET /api/entries/:id`
- `POST /api/entries`
- `PUT /api/entries/:id`
- `DELETE /api/entries/:id`

### Entry Payload Example

```json
{
  "name": "pve-01",
  "type": "Server",
  "ip": "192.168.1.10",
  "system": "Proxmox VE 8",
  "notes": "Main hypervisor",
  "parent_id": null,
  "power_source_id": null,
  "private": false
}
```
