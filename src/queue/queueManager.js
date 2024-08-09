const amqp = require("amqplib");

class QueueManager {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {};
  }

  async connect() {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    this.channel = await this.connection.createChannel();
  }

  async createQueue(queueName) {
    if (!this.queues[queueName]) {
      await this.channel.assertQueue(queueName, { durable: true });
      this.queues[queueName] = queueName;
    }
  }

  async sendMessage(queueName, message) {
    await this.channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

module.exports = new QueueManager();
