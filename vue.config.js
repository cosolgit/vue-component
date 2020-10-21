const path = require("path");

const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    lintOnSave: false,
    configureWebpack: {
        resolve: {
            extensions:[".js", ".vue"],
            alias: {
                vue$: "vue/dist/vue.esm.js",
                src: resolve("src"),
                com: resolve("src/components"),
                examples: resolve("src/examples"),
                mixins: resolve("src/mixins")
            },
        },
    },
};
