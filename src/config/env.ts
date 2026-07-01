import dotenv from "dotenv";
dotenv.config();

const requiredEnv = [
    "MONGO_URI",
] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

export const env = {
    port: Number(process.env.PORT) || 8000,

    mongoUri: process.env.MONGO_URI as string,

    nodeEnv: process.env.NODE_ENV || "development",
} as const;