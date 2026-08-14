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

## Docker

Build only the backend image:

- `docker build -t homelab-backend .`

Run backend container directly:

- `docker run --rm -p 3001:3001 -v homelab_data:/usr/src/app/data homelab-backend`

Run full stack (frontend + backend) from repository root:

- `docker-compose up --build -d`

The backend stores SQLite data under `/usr/src/app/data` inside the container.

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
