import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shopnow-API",
      version: "1.0.0",
      description:
        "This API provides functionalities for managing and purchasing clothing online.",
    },
  },
  apis: ["./routes/*.js"], // files containing annotations as above
};

let swaggerSpec;

try {
  swaggerSpec = swaggerJsdoc(options);
} catch (error) {
  console.error("Error generating Swagger spec:", error);
  // Handle the error here (e.g., log to a file, send an error response)
}

function swaggerDocs(app, port) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON Format
  app.get("/docs-json", (req, re) => {
    if (!swaggerSpec) {
      // Handle the case where swaggerSpec is not available (e.g., generation failed)
      return res
        .status(500)
        .send({ message: "Error: Swagger documentation unavailable" });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
