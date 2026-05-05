import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { MqttClient, connectAsync, type IClientOptions } from "mqtt";

declare module "fastify" {
    interface FastifyInstance {
        mqtt: MqttClient;
    }
}

const mqttPluginAsync: FastifyPluginAsync<IClientOptions> = async (
    fastify: FastifyInstance,
    options: IClientOptions,
) => {
    try {
        if(fastify.mqtt) throw new Error('mqtt plugin already initialized'); 

        const mqttClient = await connectAsync(options);
        
        fastify.addHook("onClose", async () => {
            await mqttClient.endAsync();
        });

        fastify.decorate("mqtt", mqttClient);
        
    } catch (error) {
        console.error('mqtt plugin', error);
        throw error;
    }
};

export default fp(mqttPluginAsync, {
    fastify: ">=5.x",
    name: "fastify-mqtt-client",
});
