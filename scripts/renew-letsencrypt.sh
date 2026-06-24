#!/usr/bin/env sh
set -eu

COMPOSE_FILE="docker-compose.prod.yml"

docker compose -f "$COMPOSE_FILE" run --rm certbot renew --webroot -w /var/www/certbot
docker compose -f "$COMPOSE_FILE" exec edge nginx -s reload

echo "Let's Encrypt renewal check completed."
