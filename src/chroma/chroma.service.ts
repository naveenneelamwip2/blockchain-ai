import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';
import * as fs from 'fs';
import * as pdf from 'pdf-parse';

@Injectable()
export class ChromaService {
  private client: ChromaClient;
  private queryCollection: any;
  private collection: any;

  constructor() {
    this.client = new ChromaClient();
    this.initializeCollection();
  }

  async initializeCollection() {
    this.collection = await this.client.getOrCreateCollection({ "name": "newstore6" });
    this.queryCollection = await this.client.getOrCreateCollection({ "name": "queryColl18" });
  }

  async addDocuments(documents: string[], ids: string[]): Promise<void> {
    console.log("collection items count: ", await this.queryCollection.count())

    await this.queryCollection.add({
      documents,
      ids
    });

    console.log("collection items count after adding: ", await this.queryCollection.count())
  }

  async addEmbeddings(embeddings: string[], ids: string[], documents?: string[]): Promise<void> {
    console.log("collection items count: ", await this.collection.count())
    try {
      await this.collection.add({
        documents,
        embeddings,
        ids,
      });
    } catch (error) {
      console.log(error)
    }

    console.log("collection items count after adding: ", await this.collection.count())
  }

  async getContextualDocuments(queryTexts: string): Promise<any> {

    console.log("collections items count: ", await this.queryCollection.count())
    // console.log("collection top 10 items: ", await this.queryCollection.peek())

    const results = await this.queryCollection.query({
      queryTexts: queryTexts,
      nResults: 1,
      // include: ["embeddings", "documents"]
    });

    return results
  }

  async getKeywordDocuments(keyword: string): Promise<any> {

    console.log("collections items count: ", await this.queryCollection.count())
    // console.log("collection top 10 items: ", await this.queryCollection.peek())

    const results = await this.queryCollection.get({
        "$contains": keyword
    });

    return results
  }


  async getContextualEmbeddings(queryEmbeddings: string): Promise<any> {

    console.info("collections items count: ", await this.collection.count())
    // console.log("collection top 10 items: ", await this.collection.peek())

    const results = await this.collection.query({
      queryEmbeddings: queryEmbeddings,
      nResults: 2,
      include: ["embeddings", "documents"]
    });

    return results
  }

  async resetDb(): Promise<any> {
    this.client.reset()
    return
  }

}
