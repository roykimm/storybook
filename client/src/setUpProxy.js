const { createProxyMiddleware } = require("http-proxy-middleware");
 
module.exports = function(app) {
    app.use('/api', 
        createProxyMiddleware({
        target: 'http://localhost:7010',
        changeOrigin: true,
        })
    )
}