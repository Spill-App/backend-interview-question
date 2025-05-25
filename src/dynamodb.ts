import { CreateTableCommand, CreateTableCommandInput, DeleteTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('AWS_ACCESS_KEY_ID is not defined');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS_SECRET_ACCESS_KEY is not defined');
}

if (!process.env.TABLE_NAME) {
    throw new Error('TABLE_NAME is not defined');
}

const client = new DynamoDBClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const TABLE_NAME = process.env.TABLE_NAME;

const params: CreateTableCommandInput = {
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
};

async function createTable() {
    try {
        console.log(`Checking for existing table ${TABLE_NAME}...`);
        await client.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
        console.log(`Deleted existing table ${TABLE_NAME}`);
    } catch (err: Error | any) {
        if (err.name !== 'ResourceNotFoundException') {
            console.error('Delete table error:', err);
            return;
        }
    }

    try {
        const data = await client.send(new CreateTableCommand(params));
        console.log(`Table ${TABLE_NAME} created successfully:`, data.TableDescription?.TableStatus);
    } catch (err: Error | any) {
        console.error('Create table error:', err);
    }
}

createTable();

const ddb = DynamoDBDocumentClient.from(client);

export default ddb;
