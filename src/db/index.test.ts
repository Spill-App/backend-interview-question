import { ensureMoviesTable, getDocumentClient, TABLE_NAME } from './index';
import AWS from '../utils/aws';

describe('db utilities', () => {
  it('should create the Movies table if it does not exist', async () => {
    const result = await ensureMoviesTable();
    // Should return true if created, false if already exists
    expect(typeof result).toBe('boolean');
  });

  it('should return a DocumentClient instance', () => {
    const client = getDocumentClient();
    expect(client).toBeInstanceOf(AWS.DynamoDB.DocumentClient);
  });
}); 