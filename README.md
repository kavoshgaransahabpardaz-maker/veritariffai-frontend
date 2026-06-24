# VeriTariff AI Frontend

Frontend for the trade compliance workflow at `veritariffai.co`, built with React, TypeScript, Vite, Tailwind, React Router, and TanStack Query.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

Regenerate API types from Swagger:

```bash
npm run generate:api
```

## Docker

Build the production image:

```bash
docker build -t veritariffai-front:local .
```

Run the container:

```bash
docker run -d --name veritariffai-front -p 80:80 veritariffai-front:local
```

The container serves the built SPA with Nginx and proxies `/api/*` to `https://api.veritariffai.co`.

## HTTPS Deployment With Docker Compose

For `veritariffai.co`, use the included production compose stack:

- [`docker-compose.prod.yml`](file:///Users/behnam/vscode/veritarifai-front/docker-compose.prod.yml)
- [`docker/reverse-proxy.bootstrap.conf`](file:///Users/behnam/vscode/veritarifai-front/docker/reverse-proxy.bootstrap.conf)
- [`docker/reverse-proxy.conf`](file:///Users/behnam/vscode/veritarifai-front/docker/reverse-proxy.conf)
- [`docker/nginx.conf`](file:///Users/behnam/vscode/veritarifai-front/docker/nginx.conf)
- [`scripts/init-letsencrypt.sh`](file:///Users/behnam/vscode/veritarifai-front/scripts/init-letsencrypt.sh)
- [`scripts/renew-letsencrypt.sh`](file:///Users/behnam/vscode/veritarifai-front/scripts/renew-letsencrypt.sh)

Start the stack with Let's Encrypt:

```bash
chmod +x scripts/init-letsencrypt.sh scripts/renew-letsencrypt.sh
./scripts/init-letsencrypt.sh you@example.com
```

This stack runs:

1. `frontend` -> the built SPA container on internal port `80`
2. `edge` -> public Nginx reverse proxy on ports `80` and `443`

The edge proxy:

1. redirects `http` to `https`
2. redirects `www.veritariffai.co` to `veritariffai.co`
3. proxies `/` to the frontend container
4. proxies `/api/*` directly to `https://api.veritariffai.co`

Renew the certificate later with:

```bash
./scripts/renew-letsencrypt.sh
```

## Domain Setup For `veritariffai.co`

The included Nginx config treats `veritariffai.co` as the canonical host and redirects `www.veritariffai.co` to the apex domain.

Container web server config:

- [`docker/nginx.conf`](file:///Users/behnam/vscode/veritarifai-front/docker/nginx.conf)
- [`Dockerfile`](file:///Users/behnam/vscode/veritarifai-front/Dockerfile)

To make the frontend live on `veritariffai.co`:

1. Point DNS for `veritariffai.co` to your production server IP.
2. Optionally point `www.veritariffai.co` to the same server IP.
3. Ensure ports `80` and `443` are open on the server firewall.
4. Run `chmod +x scripts/init-letsencrypt.sh scripts/renew-letsencrypt.sh`.
5. Run `./scripts/init-letsencrypt.sh you@example.com`.
6. Add a cron job or scheduled task to run `./scripts/renew-letsencrypt.sh`.

## Recommended Production Topology

Recommended setup:

1. `veritariffai.co` -> edge Nginx container
2. Edge Nginx -> frontend container for SPA routes
3. Edge Nginx -> `https://api.veritariffai.co` for `/api/*`

This keeps the browser on the main domain while API traffic continues to flow to the backend host.

## HTTPS Note

The app image itself still serves plain HTTP internally. HTTPS termination is handled by the `edge` container in the compose stack using mounted certificates.
