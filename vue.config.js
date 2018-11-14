// vue.config.js
module.exports = {
    chainWebpack: config => {
        config
            .plugin('define')
            .tap(options => {
                const newOptions = options;
                let existingDefs = newOptions.pop();
                existingDefs = Object.assign(existingDefs, {
                    API_KEY: JSON.stringify(process.env.API_KEY),
                    AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
                    DB_URL: JSON.stringify(process.env.DB_URL),
                    PROJECT_ID: JSON.stringify(process.env.PROJECT_ID),
                    STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET),
                    MESSAGING_SENDER_ID: JSON.stringify(process.env.MESSAGING_SENDER_ID),
                });
                newOptions.push(existingDefs);

                return newOptions;
            })
    },
};
