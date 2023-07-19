export const FASTIFY_LOGGER = String(process.env.FASTIFY_LOGGER) === "true";
export const PORT = Number(process.env.PORT) || 3000;
export const JWT_SECRET = String(process.env.JWT_SECRET);