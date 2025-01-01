import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Embedding } from './schemas/embedding.schema';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(Embedding.name) private embeddingModel: Model<Embedding>,
  ) { }

  async addEmbeddings(id: string, text: string, embeddings: Number[]): Promise<any> {

    const update = { $set: { text, embeddings } };
    const options = { upsert: true };

    const createdEmbedding = this.embeddingModel.updateOne({ _id: id }, update, options);

    return createdEmbedding;
  }

  async keywordSearch(keyword: string): Promise<Embedding[]> {
    return this.embeddingModel.find({ text: { $regex: keyword, $options: 'i' } }).exec();
  }

  async contextualSearch(queryEmbeddings: number[]): Promise<Embedding> {
    const embeddings = await this.embeddingModel.find().exec();
    let closestMatch = null;
    let closestDistance = Infinity;

    embeddings.forEach(embedding => {
      const distance = Math.sqrt(embedding.embeddings.reduce((sum, value, index) =>
        sum + Math.pow(value - queryEmbeddings[index], 2), 0)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestMatch = embedding;
      }
    });

    return closestMatch;
  }

  async hybridSearch(keyword: string, queryEmbeddings: number[]): Promise<Embedding> {
    const keywordResults = await this.keywordSearch(keyword);
    if (!keywordResults.length) return null;

    let closestMatch = null;
    let closestDistance = Infinity;

    keywordResults.forEach(result => {
      const distance = Math.sqrt(result.embeddings.reduce((sum, value, index) => sum + Math.pow(value - queryEmbeddings[index], 2), 0));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMatch = result;
      }
    });

    return closestMatch;
  }
}
