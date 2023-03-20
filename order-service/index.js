const express = require('express')
const mongoose = require('mongoose')
const amqp = require('amqplib')
const orderModel = require('./models/Order')

const app = express();
let connection, channel;
const queueName1 = "order-service-queue";
const queueName2 = "product-service-queue";

app.use(express.json());

mongoose
  .connect(`mongodb://localhost:27017/dborders`, { useNewUrlParser: true })
  .then(() => console.log("connexion BD reussie"))
  .catch((error) => console.log('Erreur de connexion' + error));

async function connectToRabbitMQ() {
  const amqpServer = "amqp://guest:guest@localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName1);
  await channel.assertQueue(queueName2);
}

connectToRabbitMQ().then(() => {
    channel.consume(queueName1, (data) => {
        const listprods = JSON.parse(data.content.toString());
        let total = 0.0;
        listprods.forEach(item => {
            total += item.price;
        })
        const order = new orderModel({products:listprods, total});
        order.save().then((ord)=> {
          channel.sendToQueue(queueName2, Buffer.from(JSON.stringify(ord)))
        });

        
        channel.ack(data);
    })
})

app.listen(3001, ()=> {
    console.log('serveur lance');
})