const config = {
  user: "wilian",
  password: "willkah1",
  server: "WIL-BRIT0\\SQLEXPRESS",
  database: "DGCS_ENTBIP_000088",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 40, 
    min: 0, 
    idleTimeoutMillis: 30000 
  },
  connectionTimeout: 30000,
  requestTimeout: 60000,
};

export default config;