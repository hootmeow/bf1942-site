# BF1942 Command Center

A modern, responsive Battlefield 1942 community hub built with Next.js 14, the App Router, Tailwind CSS, and shadcn-inspired UI components. The dashboard delivers player analytics, server listings, community resources, and authentication flows with light/dark theming.

## Prerequisites

Ensure the following tools are available on your Ubuntu 24.04 LTS (24.0.3) server before setting up the project:

- **Git** for cloning the repository
- **cURL** and **build-essential** packages for compiling native dependencies
- **Node.js 20 LTS** (Next.js 14 requires Node.js 18.17 or newer; Node 20 is recommended)
- **npm 10+** (installed with Node.js)

You can install everything with:

```bash
sudo apt update
sudo apt install -y git curl build-essential
```

## Install Node.js (Ubuntu 24.04 LTS)

Use the official NodeSource repository to install the latest Node.js 20 LTS binaries:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:

```bash
node --version
npm --version
```

Both commands should report versions that meet or exceed Node.js 20.x and npm 10.x.

> **Tip:** If your organization restricts outbound traffic, mirror the NodeSource setup script and npm registry (`https://registry.npmjs.org`). You can also install Node.js via **nvm** if you prefer user-level version management.

## Clone the Repository

```bash
cd /opt # or another workspace directory you prefer
sudo git clone https://github.com/your-org/bf1942-site.git
cd bf1942-site
sudo chown -R $USER:$USER .
```

If you already have SSH keys configured with GitHub, use the SSH URL instead of HTTPS.

## Install Dependencies

Install JavaScript dependencies from the npm registry:

```bash
npm install
```

If your environment uses a custom registry, point npm to it with:

```bash
npm config set registry https://registry.npmjs.org
```

The project depends on several `@radix-ui/*` packages. When working behind a corporate proxy, make sure the proxy allows scoped package downloads.

## Running the Development Server

Start the Next.js dev server with hot reloading:

```bash
npm run dev
```

By default the app is available at [http://localhost:3000](http://localhost:3000). Use `CTRL+C` to stop the server.

### Recommended Development Workflow

1. Create a feature branch: `git checkout -b feature/my-change`.
2. Run `npm run lint` to catch issues before committing.
3. Run `npm run dev` while developing UI changes.
4. Commit and push your changes for review.

## Building for Production

Compile the optimized production build:

```bash
npm run build
```

Launch the production server:

```bash
npm run start
```

The server listens on port `3000` by default. Configure reverse proxies (Nginx, Caddy, etc.) as needed for public access.

## Environment Variables

The current application runs entirely with mock data and does not require environment variables. If you later integrate live APIs or authentication providers, create a `.env.local` file at the project root and define variables there. Never commit secrets to version control.

## Maintenance Tasks

- **Dependency updates:** `npm outdated` and `npm update`.
- **Code quality:** `npm run lint`.
- **Static type checks:** `npx tsc --noEmit`.
- **Tailwind updates:** run `npx tailwindcss init` if you need to regenerate config scaffolding.

## Troubleshooting

| Issue | Resolution |
| ----- | ---------- |
| `npm install` fails with `EAI_AGAIN` or timeout | Configure HTTP/HTTPS proxy variables (`http_proxy`, `https_proxy`) or run `npm config set proxy` accordingly. |
| `npm install` returns `403` for `@radix-ui/*` packages | Ensure your npm auth token or registry proxy allows scoped packages. Manually verify with `npm view @radix-ui/react-avatar`. |
| `node: command not found` | Re-run the NodeSource setup commands or install via `nvm`. |
| Port 3000 already in use | Stop the conflicting process or set `PORT=4000 npm run dev` to bind a different port. |

For additional customization, refer to the configuration files:

- `tailwind.config.ts` – Tailwind design tokens and shadcn presets
- `app/globals.css` – theme variables and base styles
- `components/` – reusable UI primitives and layout shells

With these steps, your Ubuntu 24.04 LTS server will be ready to host and develop the BF1942 Command Center dashboard.
