import { Type, type Static } from '@sinclair/typebox';

export const MqttStatsSchema = Type.Object({
  connected: Type.Boolean(),
  reconnecting: Type.Boolean(),
  client_id: Type.String(),
});

// Infers the TypeScript type from the schema
export type MqttStats = Static<typeof MqttStatsSchema>;