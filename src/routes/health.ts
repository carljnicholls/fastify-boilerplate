import type { FastifyPluginAsync } from "fastify";
import { teapotHandler } from "../handlers/teapot.js";
import { MqttStatsSchema } from "../schemas/mqtt-stats.js";

export const healthPlugin: FastifyPluginAsync = async (fastify, _options) => {
    fastify.get(
        "/health/status",
        {
            schema: {
                response: {
                    200: {
                        type: "string",
                        description: "Heartbeat response",
                        example: "ok",
                    },
                },
                description: "Health check",
                tags: ["health"],
            },
        },
        async () => {
            return { status: "ok" };
        },
    );

    fastify.get(
        "/health/mqtt",
        {
            schema: {
                response: {
                    200: MqttStatsSchema,
                    503: MqttStatsSchema 
                },
                description: "Mqtt Client Health check",
                tags: ["health"],
            },
        },
        async (_request, reply) => {
            const stats = {
                connected: fastify.mqtt.connected,
                reconnecting: fastify.mqtt.reconnecting,
                client_id: fastify.mqtt.options.clientId,
            };

            return reply
                .status(stats.connected ? 200 : 503)
                .header("Content-Type", "application/json")
                .send(stats);
        },
    );

    fastify.get(
        "/health/teapot",
        {
            schema: {
                response: {
                    418: {
                        type: "string",
                        description:
                            "https://www.rfc-editor.org/rfc/rfc9110#section-15.5.19",
                        example: "I'm a teapot",
                    },
                },
                description: "Teapot",
                tags: ["health"],
            },
        },
        teapotHandler,
    );
};
