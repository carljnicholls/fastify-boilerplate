import type {
    FastifyInstance,
    FastifyPluginOptions,
} from "fastify";
// import { Type } from "@sinclair/typebox";

export default async function (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
): Promise<void> {
    fastify.get(
        "/",
        {
            schema: {
                response: {
                    200: fastify.getSchema('mqttStats') ,
                    // 200: Type.Ref('mqttStats#'),
                    503: fastify.getSchema('mqttStats') ,
                    // 503: Type.Ref('mqttStats#'),
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
}
