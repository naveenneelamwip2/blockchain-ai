import { Injectable } from '@nestjs/common';
import * as pinecone from 'pinecone-client';

@Injectable()
export class PineconeService {
  private index;

  // constructor() {
  //   // pinecone.init({ apiKey: 'YOUR_PINECONE_API_KEY', environment: 'us-west1-gcp' });
  //   this.index = new pinecone.PineconeClient({ apiKey: 'YOUR_PINECONE_API_KEY' });
  // }

  // async storeEmbeddings(id: string, text: string, embeddings: number[]): Promise<void> {
  //   await this.index.upsert([{ id, values: embeddings, metadata: { text } }]);
  // }

  // async contextualSearch(queryEmbeddings: number[]): Promise<string> {
  //   const results = await this.index.query({ queries: [queryEmbeddings], topK: 1 });
  //   return results.matches.length ? results.matches[0].metadata.text : null;
  // }
}
