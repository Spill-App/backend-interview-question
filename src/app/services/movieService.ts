import { v4 as uuidv4 } from 'uuid';
import { getDocumentClient, TABLE_NAME } from '../../db';

export interface Movie {
  id: string;
  title: string;
  description?: string;
  releaseDate?: string;
  popularity?: number;
}

export async function getMovie(id: string): Promise<Movie | undefined> {
  const dynamoDb = getDocumentClient();
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item as Movie | undefined;
}

export async function listPopularMovies(limit = 10): Promise<Movie[]> {
  const dynamoDb = getDocumentClient();
  const params = {
    TableName: TABLE_NAME,
    Limit: limit,
  };
  const result = await dynamoDb.scan(params).promise();
  return (result.Items as Movie[] || []).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

export async function createMovie(input: Omit<Movie, 'id'>): Promise<Movie> {
  const dynamoDb = getDocumentClient();
  const movie: Movie = { id: uuidv4(), ...input };
  const params = {
    TableName: TABLE_NAME,
    Item: movie,
  };
  await dynamoDb.put(params).promise();
  return movie;
}

export async function updateMovie(id: string, input: Partial<Movie>): Promise<Movie | undefined> {
  const dynamoDb = getDocumentClient();
  const updateExp: string[] = [];
  const expAttrNames: Record<string, string> = {};
  const expAttrValues: Record<string, any> = {};
  for (const key of Object.keys(input)) {
    updateExp.push(`#${key} = :${key}`);
    expAttrNames[`#${key}`] = key;
    expAttrValues[`:${key}`] = (input as any)[key];
  }
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: `SET ${updateExp.join(', ')}`,
    ExpressionAttributeNames: expAttrNames,
    ExpressionAttributeValues: expAttrValues,
    ReturnValues: 'ALL_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  return result.Attributes as Movie | undefined;
} 