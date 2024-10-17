# generate prisma environment file
if [ -f dist/database/prisma/scripts/bootstrap.js ]; then
  yarn node dist/database/prisma/scripts/bootstrap.js
else
  yarn ts-node -r tsconfig-paths/register src/database/prisma/scripts/bootstrap.ts
fi
