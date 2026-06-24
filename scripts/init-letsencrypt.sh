#!/usr/bin/env sh
set -eu

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <email>"
  exit 1
fi

EMAIL="$1"
DOMAIN="veritariffai.co"
WWW_DOMAIN="www.veritariffai.co"
COMPOSE_FILE="docker-compose.prod.yml"

mkdir -p certbot/www certbot/conf

cp docker/reverse-proxy.bootstrap.conf docker/reverse-proxy.conf.active

docker compose -f "$COMPOSE_FILE" up -d frontend edge

docker compose -f "$COMPOSE_FILE" run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "$WWW_DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email

cp docker/reverse-proxy.conf docker/reverse-proxy.conf.active

docker compose -f "$COMPOSE_FILE" up -d edge
docker compose -f "$COMPOSE_FILE" exec edge nginx -s reload

echo "Let's Encrypt certificate issued for $DOMAIN and $WWW_DOMAIN"
