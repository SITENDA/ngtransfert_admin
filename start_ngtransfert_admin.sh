#!/usr/bin/env bash

cd /ngtransfert/ngtransfert_admin

pm2 start ngtransfert_admin-ecosystem.config.cjs

pm2 save

pm2 status