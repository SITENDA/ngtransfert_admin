module.exports = {
    apps: [
        {
            name: "ngtransfert-admin",

            cwd: "/ngtransfert/ngtransfert_admin",

            script: "node_modules/next/dist/bin/next",

            args: "start",

            instances: 1,

            exec_mode: "fork",

            autorestart: true,

            watch: false,

            max_memory_restart: "1G",

            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],
};
