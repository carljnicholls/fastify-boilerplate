import type {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import { healthPlugin } from "./health.js";
import { userPlugin } from "./user.js";

export default class RouteBuilder {
    /**
     * Add new routes (exported as Plugins) here
     */
    private static routeProviders: Array<FastifyPluginAsync> = [
        healthPlugin,
        userPlugin,
    ];

    public static build(
        fastify: FastifyInstance,
        opts: FastifyPluginOptions,
    ): void {
        this.routeProviders.forEach((route) => {
            fastify.register(route, opts);
        });
    }
}
