module.exports = {
    apps: [{
        name: 'artisans-angular-universal-ssr',
        script: './data/tmp/server/main.js',
        cwd: __dirname + '/..',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        instances: 1,
        autorestart: true,
        watch: [
            './data/tmp/server',
            './configuration',
        ],
        out_file: './logs/angular-universal-ssr.log',
        max_memory_restart: '100M',
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        },
    }],
};
