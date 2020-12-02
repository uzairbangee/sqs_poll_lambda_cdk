const aws = require('aws-sdk');
const sqs = new aws.SQS();

exports.handler = async (event: any)  => {
    console.log("Event", event);
    const {price, quantity} = JSON.parse(event.body);
    const total = Number(price) * Number(quantity);

    const params = {
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: total.toString()
    };

    await sqs.sendMessage(params).promise();

    const response = {
        "statusCode": 200,
        "body": JSON.stringify(total)
    };
    return response;
}