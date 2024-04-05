import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "pi-serra",
      version: "0.0.1",
      description:
        "API che permette la gestione della serra della scuola. Offre dati collezionati da sensori e la possibilità di attivare attuatori."
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options)

export default (app) => {
  app.use('/api-docs', serve, setup(specs))
}