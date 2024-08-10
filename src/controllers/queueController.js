const QueueManager = require("../queue/queueManager");
const logger = require("../utils/logger");

const enqueueRequest = async (req, res) => {
  try {
    // Ensure req.user is correctly defined and accessible here
    const user = req.user;

    // Log the enqueue action
    logger.info(`Request enqueued for user: ${user.username}`);

    // Define the queue name based on the user's ID
    const queueName = `queue_${user._id}`;

    // Create the queue (if it doesn't exist) and send the message to the queue
    await QueueManager.createQueue(queueName);
    await QueueManager.sendMessage(queueName, JSON.stringify(req.body));

    // Respond to the client with success
    res.status(200).send({ success: true, message: "Request enqueued" });
  } catch (err) {
    // Log the error and respond with failure
    logger.error(
      `Failed to enqueue request for user: ${req.user.username}, Error: ${err.message}`
    );
    res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = { enqueueRequest };
