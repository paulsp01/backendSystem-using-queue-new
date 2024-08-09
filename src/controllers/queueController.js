const QueueManager = require("../queue/queueManager");

const enqueueRequest = async (req, res) => {
  try {
    const queueName = `queue_${req.user._id}`;
    await QueueManager.createQueue(queueName);
    await QueueManager.sendMessage(queueName, JSON.stringify(req.body));
    res.status(200).send({ success: true, message: "Request enqueued" });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = { enqueueRequest };
