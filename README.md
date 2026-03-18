# CADApprovals

A lightweight static prototype for a CAD/spec approval workflow between factories and admins.

## What it includes

- Factory submission form requiring either a Barcode/UID or Web Order Number.
- Automatic `File Uploaded` status when a new line is submitted.
- Admin review workspace with uploaded file details, chat-style comments, and status updates for `Revision` or `Approved`.
- Industrial/glassmorphism visual treatment inspired by the referenced Factory look and feel.

## Run locally

Because the project is static, you can open `index.html` directly in a browser or serve it with a simple HTTP server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
