#!/usr/bin/env bash

cd /ngtransfert/ngtransfert_admin

yarn build

pm2 start "yarn start" \
  --name ngtransfert-admin \
  --env production

pm2 save