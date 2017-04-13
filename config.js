exports.DEBUG = (process.env.NODE_ENV === "development")
exports.serverPort = parseInt(process.env.PORT, 10) || 8070
exports.contextPath = process.env.CONTEXT_PATH || '/'
exports.baseUrl = process.env.BASE_URL || ''
exports.ipAddress = process.env.IP_ADDRESS || '127.0.0.1'
exports.domainName = process.env.DOMAIN_NAME || '127.0.0.1'
exports.dbName = process.env.DB_NAME || 'menuxx'
exports.dbHost = process.env.DB_HOST || '127.0.0.1'
exports.dbUser = process.env.DB_USER || 'root'
exports.dbPassword = process.env.DB_PASSWORD || ''
exports.dbPort = parseInt(process.env.DB_PORT, 10) || 3306