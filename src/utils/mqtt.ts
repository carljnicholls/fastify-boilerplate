import type { FastifyReply } from "fastify";
import { toStringOrBuffer } from "./type-guards.js";

export const setReplyMqtt = (
    topic: string,
    reply: FastifyReply,
    res: unknown,
    qos: number = 0,
    retain: boolean = false,
) => {
    reply.mqtt = {
        options: {
            topic,
            qos,
            retain,
        },
        payload: toStringOrBuffer(res),
    };
};
