import swagger from "@fastify/swagger";
import fp from "fastify-plugin";
import packageJson from "../../package.json" with { type: "json" };

export default fp(async (fastify) => {
    fastify.register(swagger, {
        openapi: {
            info: {
                title: packageJson.name,
                description: packageJson.description,
                version: packageJson.version,
                //...
            },
        },
    });
});
