export default () => ({
    environment: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
    apiKey: process.env.API_KEY,
    tfaAppName: process.env.TFA_APP_NAME
})