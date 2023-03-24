const AWS = require("aws-sdk"); //imports aws sdk
const s3 = new AWS.S3(); //initalize s3 object, acces to s3

// bucket name env var will be set in serverless.yml file
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;//retrieve env variable storing bucket name

module.exports.handler = async event => { //framwork for lambda handler, functio hnadler, takes in event 
    console.log(event); //logs event, api gateway trigger event

    const response = { //intalize response object thatll be returned from endpoint
        isBase64Encoded: false,
        statusCode: 200,//required field
    };

try { 
    const params = {
        Bucket: BUCKET_NAME,//retrieve file below
        Key: decodeURIComponent(event.pathParameters.fileKey), //key passed as file parameter in serverless file
    };
//retrieve bucket under key
    const getResult = await s3.getObject(params).promise();
    response.body = JSON.stringify({message: "Successfully retrieved file from s3", getResult }); //modify response body for good practice ensure stringfyd json
} catch (e) {

    console.error(e);//log the error
    response.body = JSON.stringify({message: "Failed to get file.", errorMessage:e });//also can include itin response body
    response.statusCode = 500;//change satus code when lambda fails
}

return response;
    };

