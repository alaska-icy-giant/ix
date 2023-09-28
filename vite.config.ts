import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

const { gitDescribeSync } = require("git-describe");
process.env.VITE_GIT_HASH = gitDescribeSync().hash;
process.env.VITE_VER = require("./package.json").version;
process.env.VITE_APP_NAME = require("./package.json").name;
process.env.VITE_LAST_UPDATE = Date() + "";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ix/",
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: "src/quasar-variables.sass",
    }),
  ],
});
