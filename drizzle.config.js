import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./configs/schema.js*",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials : {
        url : 'postgresql://neondb_owner:npg_GTO1x7ZYDmft@ep-holy-haze-a1dt25yg-pooler.ap-southeast-1.aws.neon.tech/AI-Form-Builder?sslmode=require&channel_binding=require'
    }
})