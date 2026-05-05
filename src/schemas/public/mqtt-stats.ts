import { Type, type Static } from "@sinclair/typebox";

export const MqttStatsSchema = Type.Object(
    {
        connected: Type.Boolean(),
        reconnecting: Type.Boolean(),
        client_id: Type.String(),
    },
    {
        $id: "mqttStats",
        title: "MqttStats",
        description: "Statistics about the MQTT client connection status",
    },
);

export type MqttStats = Static<typeof MqttStatsSchema>;

