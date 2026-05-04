import type { FastifyReply, FastifyRequest, onResponseHookHandler } from "fastify";

export const mqttResponseHook: onResponseHookHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        if (reply.statusCode < 300 && reply.mqtt?.payload) {
            await request.server.mqtt.publishAsync(
                reply.mqtt.options.topic,
                reply.mqtt.payload,
                reply.mqtt.options,
            );
        }        
    } catch (error) {
        reply.log.error(error);
        /** 
         * Do not rethrow 
         */
    }
};
