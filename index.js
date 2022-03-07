const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };
    
    try {
        switch (event.routeKey) {
            case 'DELETE /items/{id}':
                
                await dynamo.delete({
                    TableName: "http-crud-tutorial",
                    Key: {
                        id: event.pathParameters.id
                    }
                }).promise();
                
                body = `Deleted Item: ${event.pathParameters.id}`;
                break;
            
            case 'GET /items/{id}':
                
                body = await dynamo.get({
                    TableName: "http-crud-tutorial",
                    Key: {
                        id: event.pathParameters.id
                    }
                }).promise();
                
                break;
                
            case 'GET /items':
                
                body = await dynamo.scan({
                    TableName: "http-crud-tutorial"
                }).promise();
                
                break;
            
            case 'PUT /items':
                
                let requestJSON = JSON.parse(event.body);
                await dynamo.put({
                    TableName: "http-crud-tutorial",
                    Item: {
                        id: requestJSON.id,
                        price: requestJSON.price,
                        name: requestJSON.name
                    }
                }).promise();
                
                body = `Created new item: ${requestJSON.id}`;
                break;
                    
            default:
                throw new Error(`Unsupported Error: ${event.routeKey}`);
        }
    } catch (e) {
        statusCode = 400;
        body = e.message;
    } finally {
        body = JSON.stringify(body);
    }
    
    return {
        statusCode,
        body,
        headers
    };

};
