import { Pool, PoolConfig } from 'pg';

const globalForDb = globalThis as unknown as {
    postgresPool: Pool | undefined;
}

// Determine connection settings
const connectionString = process.env.POSTGRES_DSN || "postgresql://bf1942_db_user:core2duo@127.0.0.1:5432/bf1942_data";

// If connecting to a remote DB (not localhost/127.0.0.1), we might need SSL
const isRemote = !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");

const config: PoolConfig = {
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000, // Increased timeout
};

// Only add SSL if explicitly needed or usually for remote connections
if (isRemote || process.env.POSTGRES_SSL === 'true') {
    config.ssl = {
        rejectUnauthorized: false
    };
}

export const pool = globalForDb.postgresPool ?? new Pool(config);

// Add an error handler to the pool to prevent crashing the app on idle client errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    // process.exit(-1) // Don't exit on dev
})

if (process.env.NODE_ENV !== 'production') globalForDb.postgresPool = pool;
