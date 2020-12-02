const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event: any) => {
    console.log(event);
    // for (const record of event.Records) {
    //     const id = record.body;
    //     console.log(id);

        // const params = {
        //     TableName: process.env.TABLE_NAME,
        //     Item: {
        //         "id": {
        //             N: id
        //         }
        //     }
        // }

        // await dynamodb.putItem(params).promise();
    // }

    return;
}