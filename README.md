# homelab.md

A single-file, offline-first web app for documenting your homelab infrastructure. Open `index.html` in any browser — no server, no dependencies, no internet required.

## Screenshot

![homelab.md screenshot](screenshot-new-fixed.png)

## What It Does

homelab.md gives you a clean interface to catalog every device in your homelab: servers, VMs, LXC containers, network gear, storage, and anything else you're running. It saves everything to a single `homelab.md` Markdown file that you can version with Git, edit in any text editor, or back up however you like.

## Features

- **Full CRUD** — Add, edit, view, and delete entries from the browser UI
- **Parent-child relationships** — Link VMs, containers, and other entries to their host (e.g. LXCs on Proxmox, VMs on TrueNAS). The Host / Parent dropdown is constrained to types that actually make sense (a VM can only sit under a Server, a container under a Server or VM, and so on)
- **Power-source relationships** — Independently track which UPS each entry is plugged into, so you can see your power dependencies separately from the network tree. VMs and containers automatically inherit power from their host in the Power view
- **Free-form tags** — Tag entries with anything that's useful to you (`media`, `prod`, `experimental`, etc.). Tags are lowercased and de-duplicated on save, render as chips on each card, and a chip row appears alongside the type filter so you can click to narrow the view. Tags round-trip through every export format and feed into search
- **Structured services** — Each entry can have multiple services with name, port, notes, a clickable URL, and an optional per-row Private flag
- **Structured storage** — Track multiple drives per entry with type, size, notes, and an optional per-row Private flag
- **Per-type field visibility** — The edit form hides fields that don't apply to the selected type, so a UPS doesn't ask for an OS, a network switch doesn't ask for storage drives, and so on
- **Private flag** — Mark a whole entry, just its Notes block, or individual service/storage rows as Private to keep them out of the public exports
- **Markdown import/export** — The `homelab.md` file is the source of truth. Import to load, export to save. The round-trip is lossless: every field, including timestamps and Notes that contain Markdown like `---` rules, survives an export → import cycle
- **JSON import/export** — Export your full inventory as `homelab.json`, a lossless dump of every entry (Private included) for backups or feeding into other tools. The same **↑ Import** button accepts `homelab.json` and restores it exactly
- **CSV export** — Export your full inventory as `homelab.csv` for spreadsheet use, audits, or one-off scripts (includes every entry, Private flag included)
- **Public HTML export** — Export a sanitized, self-contained `homelab.html` that renders an interactive read-only version of the dashboard, ideal for hosting publicly
- **Unsaved-changes indicator** — A small dot appears on the **↓ Export** button whenever the in-browser data is newer than your last full export, so you don't forget to save changes back to the file
- **Undo on delete** — Deleting an entry shows a toast with an **Undo** button (~6 seconds) that fully restores the entry and any parent / power-source links
- **Safe import** — Importing prompts before replacing existing data and refuses to import a file with no parseable entries, so you can't accidentally wipe your inventory
- **Topology view** — Toggle between Cards and Topology to see a tree-style SVG graph of your homelab. The Topology view has its own **Network / Power** mode switch: Network shows parent → child relationships (solid lines), Power shows UPS → powered-devices relationships (dashed lines, with VMs and containers inherited from their host's power source). Multi-level chains (e.g. Modem → Router → Switch 1 → Switch 2 → Server) render fully. Type filter and search apply to both modes. Available in the main app and the public HTML export
- **Search and filter** — Filter by entry type or search across names, IPs, OS / firmware, system, CPU / RAM / GPU, location, services, storage, and notes
- **Completely offline** — No server, no API calls, no CDN. Just one HTML file

## How To Use

1. Download `index.html` and put it in a folder on your machine
2. Open `index.html` in your browser
3. Click **+** to add your first entry
4. Pick a type — the form will hide fields that don't apply (a UPS won't ask for an OS or CPU, a network switch won't ask for storage, etc.)
5. Fill in the details — name, IP, system, OS / firmware, CPU, RAM, GPU, storage, location, services, and notes
6. For VMs, containers, or anything that runs on top of another entry, use the **Host / Parent** dropdown to link it to its host. The dropdown only offers types that make sense for the child type you picked
7. For entries plugged into a UPS, use the **Power Source** dropdown — only UPS entries are eligible. This is independent of the network parent so a single entry can have both (e.g. a Server hosted on a Switch, powered by a UPS). VMs and containers don't get a Power Source of their own — they inherit it from their host
8. Tick **Private** on an entry, row, or the Notes block to keep it out of the public exports
9. Click **↓ Export** and choose **homelab.md** under **Full export** to save your data as `homelab.md`

### How Data Is Stored

While you're working, your data lives in the browser's `localStorage`. This means your changes persist between page refreshes and browser restarts without needing to do anything. However, `localStorage` is tied to your browser and can be cleared at any time, so it should not be treated as permanent storage.

The `homelab.md` file is the source of truth. Anytime you make changes through the UI, you should export to save those changes back to the file. A small orange dot appears on the **↓ Export** button whenever the data in your browser is newer than your last full export — a visual nudge so you don't forget. If you ever need to ensure your current session matches the file (for example, after editing the `.md` file directly in a text editor, or opening the app in a different browser), click **↑ Import** and select your `homelab.md` file. Importing fully replaces whatever is in `localStorage` with the contents of the file — when existing data is present, you'll be asked to confirm before it's overwritten, and a file with no parseable entries is rejected so a wrong selection can't wipe your inventory.

### Workflow

The intended workflow is:

1. **Import** your `homelab.md` if you need to sync the UI with the file
2. **Make changes** — add entries, update services, etc.
3. **Export** to save everything back to `homelab.md`
4. **Commit** the file to Git if you want version history

### The Markdown File

The exported `homelab.md` is human-readable Markdown. Each entry is an `h1` section with metadata as a bullet list, and services/storage as Markdown tables. The Private and Notes-Private flags are serialized as bullet fields so they round-trip cleanly. You can read it, edit it in any text editor, or render it on GitHub. Parent-child and power-source relationships are preserved via IDs in the footer of each section (`ParentID` and `PowerID`).

Pipe characters (`|`) and newlines inside service or storage notes are escaped on export (`\|`) and unescaped on import, so a note containing `|` won't break the table or get truncated on re-import.

### CSV Export

The **↓ Export → homelab.csv** option (under **Full export**) produces a flat `homelab.csv` with one row per entry. Multi-value fields (services, storage) are joined with `;` inside a cell, and the `Private` / `NotesPrivate` flags are included as columns. This is a full export, so Private entries and rows are **not** filtered out — it's intended for spreadsheets, ad-hoc reporting, or feeding the inventory into other tools. It is **not** round-trippable; the `homelab.md` Full export remains the canonical save format.

### JSON Import / Export

The **↓ Export → homelab.json** option (under **Full export**) writes a `homelab.json` file: a complete, lossless dump of every entry exactly as stored, wrapped with a small header (`format`, `version`, `exportedAt`) plus an `entries` array. Like the other full exports it includes **Private** entries and rows, so keep it as private as your `homelab.md`.

The **↑ Import** button accepts `homelab.json` too (alongside `homelab.md`) — it detects the format automatically and restores every entry exactly, IDs, relationships, and timestamps included. Because JSON escapes everything, it's the most faithful backup/restore path; `homelab.md` remains the canonical, human-readable, Git-friendly format.

### Public HTML Export

The **↓ Export → homelab.html** option (under **Public export**) generates a `homelab.html` file: a single, self-contained HTML page that mirrors the look and interactivity of the homelab.md UI but in a read-only form. Drop it on any static host and you get a live, searchable, filterable dashboard of your homelab.

When you choose this export, you'll be prompted for a **Site Name** that replaces "homelab.md" in the top-left of the exported page (e.g. "My Homelab"). The exported file:

- Uses the same theme and layout as the main app
- Supports search, type filters, the Cards / Topology view toggle (Network and Power modes), and the entry detail modal
- Has no add/edit/delete/import/export controls — it's strictly read-only
- Applies **Private filtering and sanitization** before writing (Private entries/rows are omitted; IPs, MAC addresses, URLs, ports, IDs, and timestamps are removed). Sanitization isn't a guarantee — review the exported file before hosting it, especially free-form Notes
- Is fully offline — no server, no API calls, just one HTML file

## Entry Types

- **Server** — Physical machines (Proxmox hosts, Raspberry Pis, mini-PCs, etc.)
- **Virtual Machine** — VMs running on a host
- **Container / LXC** — Containers running on a host or a VM
- **Network Device** — Switches, routers, gateways, access points
- **Storage / NAS** — NAS boxes and dedicated storage appliances
- **UPS / Power** — Battery backups and other power sources; appears in the Power topology view as the root of whatever it powers
- **Other** — KVMs, sensors, or anything that doesn't fit the categories above

## Requirements

A web browser. That's it.

The app uses Google Fonts for typography (JetBrains Mono and IBM Plex Sans). These will load if you're online, but the app works fine without them — your browser will fall back to system monospace and sans-serif fonts.

## AI Disclosure

This project was created with the help of AI.
