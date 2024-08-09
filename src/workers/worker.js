const amqp = require("amqplib");

const processMessage = async (msg) => {
  const requestData = JSON.parse(msg.content.toString());
  console.log(`Processing request: ${requestData}`);
  // Add your processing logic here
};

const startWorker = async (queueName) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      await processMessage(msg);
      channel.ack(msg);
    }
  });
};

// Replace with actual client queue names in a production setup
startWorker("queue_clientId1");
