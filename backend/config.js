/* eslint-disable import/no-extraneous-dependencies */
const { S3 } = require('aws-sdk');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});
const AwsUserProfileImagesBucket = `${process.env.AWS_BUCKET_NAME}/profile-images`;

let uri;

switch (process.env.NODE_ENV) {
    case 'development':
        uri = process.env.DEV_URI;
        break;
    case 'production':
        uri = process.env.PROD_URI;
        break;
    case 'testing':
        uri = process.env.TEST_URI;
        break;
    default:
        throw new Error(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);
}

module.exports = {
    NodeEnv: process.env.NODE_ENV,
    Port: process.env.PORT,
    MongodbUri: uri,
    JwtSecret: process.env.JWT_SECRET,
    JwtExpiresIn: process.env.JWT_EXPIRES_IN,
    FrontendOrigin: process.env.FRONTEND_ORIGIN,
    PostmanApi: `${process.env.POSTMAN_API}${process.env.POSTMAN_ACCESS_KEY}`,
    GoogleAuthClientID: process.env.CLIENTID,
    S3ClientObject: s3,
    AwsUserProfileImagesBucketName: AwsUserProfileImagesBucket,
    AwsBucketUrl: process.env.AWS_BUCKET_URL,
    GmailID: process.env.GMAIL_ID,
    GmailPassword: process.env.GMAIL_PASSWORD,
    NovuAPI: process.env.NOVU_API,
    NovuTriggerIdentifier: process.env.NOVU_WORKFLOW_TRIGGER_IDENTIFIER,
};
