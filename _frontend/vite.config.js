import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
    server: {
        port: 3000,     // dev server port
        open: true      // auto-open browser
    },
    plugins: [tailwind()]
});