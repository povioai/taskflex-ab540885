#!/bin/sh

# generate prisma client
yarn prisma generate
# todo, do we need to rebuild ?
yarn rebuild @prisma/client 1>/dev/null