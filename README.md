# BF1942 Command Center

A modern, responsive Battlefield 1942 community hub built with Next.js 15, the App Router, Tailwind CSS, and shadcn-inspired UI components. The dashboard delivers player analytics, server listings, community resources, authentication flows, and administrative tools with light/dark theming.

## Features

- **Player Statistics & Analytics** - Comprehensive player profiles, session tracking, and performance metrics
- **Server Directory** - Live server listings with real-time player counts and map rotation
- **Authentication System** - Secure login/signup with NextAuth 5.0 and PostgreSQL session management
- **Admin Panel** - Administrative tools for player management, claims, and whitelisting
- **Community Features** - Clans, challenges, achievements, battle buddies, and leaderboards
- **Content Hub** - Guides, mods, wiki (maps, weapons, gameplay), and news articles
- **Interactive Tools** - Signature generation, search functionality, and player comparison views
- **Game Health Dashboard** - Real-time server monitoring and network statistics
- **API Integration** - Proxy configuration for backend API communication

## Prerequisites

Ensure the following tools are available before setting up the project:

- **Git** for cloning the repository
- **Node.js 20 LTS** (Next.js 15 requires Node.js 18.17 or newer; Node 20 is recommended)
- **npm 10+** (installed with Node.js)
- **PostgreSQL 12+** for database functionality
- **cURL** and **build-essential** packages for compiling native dependencies (Linux/Ubuntu)

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

Start the Next.js dev server with Turbo mode for faster hot reloading:

```bash
npm run dev
```

By default the app is available at [http://localhost:3000](http://localhost:3000). Use `CTRL+C` to stop the server.

### Windows Development

For Windows developers, a PowerShell script is included to generate placeholder achievement images:

```powershell
.\fill_placeholders.ps1
```

To generate static assets for signature images:

```bash
node generate-static.js
```

### Recommended Development Workflow

1. Create a feature branch: `git checkout -b feature/my-change`.
2. Run `npm run lint` to catch issues before committing.
3. Run `npm run dev` while developing UI changes.
4. Commit and push your changes for review.

## Building for Production

Compile the optimized production build:

Create a `.env.local` file at the project root with the following required variables:

```env
# PostgreSQL Database Connection
This will also run the post-build notification script (`scripts/notify-deploy.js`).

Launch the production server:

```bash
npm run start
```

The server listens on port `3000` by default. Configure reverse proxies (Nginx, Caddy, etc.) as needed for public access.

## Database Setup

TheProject Structure

```
app/              # Next.js app router pages and API routes
  ├── actions/    # Server actions for data mutations
  ├── admin/      # Admin panel pages
  ├── api/        # API route handlers
  └── ...         # Feature-specific page routes
components/       # Reusable React components
  └── ui/         # Base UI components (shadcn-based)
content/          # Static content (maps, mods documentation)
hooks/            # Custom React hooks
lib/              # Utility functions, database, auth, schemas
public/           # Static assets (images, fonts)
scripts/          # Build and deployment scripts
```

## Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **PostgreSQL** - Primary database with pg driver
- **NextAuth 5.0** - Authentication and session management
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization and charts
- **React Hook Form + Zod** - Form validation and handling
- **Lucide React** - Icon library

## Maintenance Tasks

- **Dependency updates:** `npm outdated` and `npm update`
| Database connection errors | Verify `POSTGRES_DSN` is correctly set in `.env.local`. Check PostgreSQL server is running and accessible. For remote connections, ensure `POSTGRES_SSL=true` is set if required. |
| Authentication not working | Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are properly configured in environment variables. |
- **Code quality:** `npm run lint`
- **Static type checks:** `npx tsc --noEmit`
- **Regenerate static assets:** `node generate-static.js`
- Achievement tracking and challenge systems
- `next.config.mjs` – Next.js configuration including API rewrites
- `lib/schemas.ts` – Zod validation schemas
- `lib/db.ts` – PostgreSQL connection pool configuration

## Scripts

- `npm run dev` - Start development server with Turbo mode
- `npm run build` - Build for production (includes post-build notification)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks
- `node generate-static.js` - Generate base64-encoded static assets for signatures
- `.\fill_placeholders.ps1` - (Windows) Generate placeholder achievement images

With these steps, yourerly configured and the connection string is set in the `POSTGRES_DSN` environment variable. The application expects the database schema to be initialized before first run

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

**Important:** Never commit the `.env.local` file or any secrets to version control. The `.gitignore` file is configured to exclude environment files
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
