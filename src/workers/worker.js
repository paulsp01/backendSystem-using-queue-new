const amqp = require("amqplib");
const logger = require("./utils/logger"); // Import the logger

const processMessage = async (msg) => {
  const requestData = JSON.parse(msg.content.toString());
  logger.info(`Processing request: ${JSON.stringify(requestData)}`); // Log the processing of the request
  // Add your processing logic here
};

const startWorker = async (queueName) => {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    logger.info(`Worker started, listening to queue: ${queueName}`); // Log the worker startup

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          await processMessage(msg);
          channel.ack(msg);
          logger.info(
            `Request processed and acknowledged: ${msg.content.toString()}`
          ); // Log successful processing
        } catch (err) {
          logger.error(`Error processing message: ${err.message}`); // Log any errors during processing
        }
      }
    });
  } catch (err) {
    logger.error(`Failed to start worker: ${err.message}`); // Log any errors during the worker startup
  }
};

// Replace with actual client queue names in a production setup
startWorker("queue_clientId1");
