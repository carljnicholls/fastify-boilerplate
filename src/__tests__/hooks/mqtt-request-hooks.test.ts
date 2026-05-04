import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { mqttResponseHook } from "../../hooks/mqtt-response-hook.js";

describe('mqttResponseHook', () => {
    let mockRequest: any;
    let mockReply: any;
    let publishAsyncSpy: jest.Mock;
    let logErrorSpy: jest.Mock;

    beforeEach(() => {
        publishAsyncSpy = jest.fn().mockResolvedValue(undefined as never);
        logErrorSpy = jest.fn();

        mockRequest = {
            server: {
                mqtt: { publishAsync: publishAsyncSpy }
            }
        };

        mockReply = {
            statusCode: 200,
            log: { error: logErrorSpy },
            mqtt: {
                payload: 'raw-payload-data', // Could be string or Buffer
                options: {
                    topic: 'test/topic',
                    qos: 1
                }
            }
        };
    });

    it('should publish payload directly without extra stringification', async () => {
        expect.assertions(1);
        
        mqttResponseHook.call(mockRequest.server, mockRequest, mockReply, () => {});

        expect(publishAsyncSpy).toHaveBeenCalledWith(
            'test/topic',
            'raw-payload-data',
            mockReply.mqtt.options
        );
    });

    it('should catch MQTT errors and log them using reply.log.error', async () => {
        expect.assertions(1);
        const mqttError = new Error('Broker Unavailable');
        publishAsyncSpy.mockRejectedValueOnce(mqttError as never);

        await mqttResponseHook.call(mockRequest.server, mockRequest, mockReply, () => {});

        expect(logErrorSpy).toHaveBeenCalledWith(mqttError);
    });

    it('should skip publishing if statusCode is 400', async () => {
        mockReply.statusCode = 400;

        mqttResponseHook.call(mockRequest.server, mockRequest, mockReply, () => {});

        expect(publishAsyncSpy).not.toHaveBeenCalled();
    });

    it('should skip publishing if reply.mqtt is undefined', async () => {
        expect.assertions(1);

        delete mockReply.mqtt;

        mqttResponseHook.call(mockRequest.server, mockRequest, mockReply, () => {});

        expect(publishAsyncSpy).not.toHaveBeenCalled();
    });

    it('should handle Buffer payloads correctly', async () => {
        expect.assertions(1);

        const bufferPayload = Buffer.from('binary-content');
        mockReply.mqtt.payload = bufferPayload;

        mqttResponseHook.call(mockRequest.server, mockRequest, mockReply, () => {});

        expect(publishAsyncSpy).toHaveBeenCalledWith(
            expect.any(String),
            bufferPayload, // Verified it stays a Buffer
            expect.any(Object)
        );
    });
});