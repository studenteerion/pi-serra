const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "pi-serra",
      version: "0.2.1",
      description:
        "API che permette la gestione della serra della scuola. Offre dati collezionati da sensori e la possibilità di attivare attuatori."
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'API server',
      }
    ],
  },
  apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options)

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}