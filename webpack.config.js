module.exports = {
    resolve: {
        root: __dirname
    },


    entry: {
        app: "./js_src/app.js"
    },


    output: {
        path: "./sqs_template/scripts/",
        filename: "app.js"
    },


    module: {
        loaders: [
            {
                test: /js_src\/.*\.js$/,
                exclude: /node_modules|jquery/,
                loaders: ["babel-loader"]
            },

            {
                test: /jquery\.js$/,
                loader: "expose?$!expose?jQuery"
            }
        ]
    }
};