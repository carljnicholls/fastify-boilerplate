import { afterAll, expect, test, describe, it, beforeEach, vi } from 'vitest'
import { setReplyMqtt } from '../../utils/mqtt'

describe('setReplyMqtt', () => {
    it('should create mqtt options with default qos 0 and retain false', () => {
        const topic = 'test_topic'
        const reply = {} as any
        const res = 'test response'
        setReplyMqtt(topic, reply, res)
        expect(reply.mqtt.options.topic).toBe(topic)
        expect(reply.mqtt.options.qos).toBe(0)
        expect(reply.mqtt.options.retain).toBe(false)
    })

    it('should create mqtt options with custom qos and retain', () => {
        const topic = 'test_topic'
        const reply = {} as any
        const res = 'test response'
        setReplyMqtt(topic, reply, res, 2, true)
        expect(reply.mqtt.options.topic).toBe(topic)
        expect(reply.mqtt.options.qos).toBe(2)
        expect(reply.mqtt.options.retain).toBe(true)
    })

    it('should convert payload to buffer if necessary', () => {
        const topic = 'test_topic'
        const reply = {} as any
        const res = new Buffer(12345) // number
        setReplyMqtt(topic, reply, res)
        expect(reply.mqtt.payload).toBeInstanceOf(Buffer)
    })
})