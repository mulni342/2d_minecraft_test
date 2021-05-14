const path = require("path");
const browser_sync_plugin = require("browser-sync-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./dist")
    },

    plugins: [
        new browser_sync_plugin({
            host: "localhost",
            port: 3000,
            server: { baseDir: path.resolve("./dist") }
        })
    ],

    watch: true
}