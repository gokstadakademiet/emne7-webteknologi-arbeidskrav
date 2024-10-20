import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Javazone 2024 API",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Development server",
        },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: ["./routes/*.js"],
};

export default swaggerJSDoc(options);
