import "dotenv/config";
import { defineConfig } from "prisma/config";

// La DDL est gérée côté Supabase (prisma/sql/supabase_init.sql) ; Prisma sert de client typé.
// `url` (introspection / db pull) prend la connexion directe, avec repli sur les variables
// injectées par l'intégration Vercel↔Supabase.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.POSTGRES_URL_NON_POOLING ??
      process.env.DATABASE_URL ??
      "",
  },
});
