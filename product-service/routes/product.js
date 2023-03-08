const express = require("express");
const ProductModel = require("../models/Product");
const amqp = require("amqplib");

const routes = express.Router();

let connection, channel;
const queueName1 = "order-service-queue";
const queueName2 = "product-service-queue";

async function connectToRabbitMQ() {
  const amqpServer = "amqp://guest:guest@localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName1);
  await channel.assertQueue(queueName2);
}
connectToRabbitMQ();

routes.post("/", (req, res) => {
  const product = new ProductModel(req.body);

  product
    .save()
    .then((prod) => {
      res.json({ message: "Produit sauvegarde", prod });
    })
    .catch((err) => {
      res.sendStatus(500).json({ message: err });
    });
});

routes.post("/buy", (req, res) => {
    ProductModel.find({_id: {$in:req.body}}).then((products) => {
        channel.sendToQueue(queueName1, Buffer.from(JSON.stringify(products)));
    })

    res.sendStatus(200);
});

module.exports = routes;
