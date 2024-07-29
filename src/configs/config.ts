const config = {
  user: "wilian",
  password: "willkah1",
  server: "WIL-BRIT0\\SQLEXPRESS",
  database: "DGCS_ENTBIP",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 20, // Número máximo de conexões no pool
    min: 0,  // Número mínimo de conexões no pool
    idleTimeoutMillis: 30000 // Tempo ocioso antes de fechar a conexão
  },
  connectionTimeout: 30000, // 30 segundos
  requestTimeout: 30000 // 30 segundos
};

export default config;