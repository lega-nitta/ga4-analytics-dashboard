#!/bin/sh
set -e

# DATABASE_URL が設定されている場合のみマイグレーション実行（app 起動時）
if [ -n "$DATABASE_URL" ] && [ "$1" = "npm" ] && [ "$2" = "run" ] && [ "$3" = "start" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
fi

exec "$@"
