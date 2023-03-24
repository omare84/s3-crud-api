const AWS = require("aws-sdk"); //imports aws sdk
const s3 = new AWS.S3(); //initalize s3 object, acces to s3 

// bucket name env var will be set in serverless.yml file
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async event => { //framework for lambda handler
    console.log(event); //logs event, api gateway trigger event

    // The output from a Lambda proxy integration must be 
    // in the following JSON object. The 'headers' property 
    // is for custom response headers in addition to standard 
    // ones. The 'body' property  must be a JSON string. For 
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
    const response = { //response object
        isBase64Encoded: false,
        statusCode: 200,//required field
    };

    try {
        const parsedBody = JSON.parse(event.body);
        const base64File = parsedBody.file; //decoding base64 file for able to upload as image
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64"); //buffer reads base64
        const params = { //stores uploading params for bucket
            Bucket: BUCKET_NAME,
            Key: parsedBody.fileKey, //filename 
            Body: decodedFile, //file that is decoded
            ContentType: "image/jpeg",
        };
        const uploadResult = await s3.upload(params).promise();//perform the upload

        response.body = JSON.stringify({ message: "Successfully uploaded file to S3", uploadResult });//upload result in response bdy
    } catch (e) {
        console.error("Failed to upload file: ", e); //log error
        response.body = JSON.stringify({ message: "File failed to upload.", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};