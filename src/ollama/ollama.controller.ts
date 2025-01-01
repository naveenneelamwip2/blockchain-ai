import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { ChromaService } from '../chroma/chroma.service';
import { MongoService } from 'src/mongo/mongo.service';
import { range } from 'rxjs';

@Controller('ollama')
export class OllamaController {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly chromaService: ChromaService,
    private readonly mongoService: MongoService,
  ) { }

  @Post('embeddings')
  async createEmbeddings(@Body('input') input: string, @Body('id') id: string) {
    const embeddings = await this.ollamaService.getEmbeddings(input);

    await this.chromaService.addEmbeddings(embeddings.embeddings, [id], [input]);
    await this.mongoService.addEmbeddings(id, input, embeddings.embeddings[0]);

    return { message: 'Embeddings stored successfully', embeddings };
  }

  @Post('generateUsingEmbeddings')
  async generateOutputUsingEmbeddings(@Body('input') input: string) {
    const embeddingsOfQuery = await this.ollamaService.getEmbeddings(input);

    const keywordBasedMongoDb = await this.mongoService.keywordSearch(input);

    const context = await this.chromaService.getContextualEmbeddings(embeddingsOfQuery.embeddings);
    const contextMongodb = await this.mongoService.contextualSearch(embeddingsOfQuery.embeddings[0]);

    const hybridSearchMongodb = await this.mongoService.hybridSearch(input, embeddingsOfQuery.embeddings[0]);

    // const output = await this.ollamaService.generateOutput(input, context);
    return { context, keywordBasedMongoDb, contextMongodb, hybridSearchMongodb };
  }

  @Post('documents')
  async createDocuments(@Body('input') input: string, @Body('id') id: string) {
    await this.chromaService.addDocuments([input], [id]);
    return { message: 'Documents are stored successfully' };
  }

  @Post('generateUsingDocuments')
  async generateOutputUsingDocuments(@Body('input') input: string) {
    const contextSearch = await this.chromaService.getContextualDocuments(input);
    const keywordSearch = await this.chromaService.getKeywordDocuments(input);
    const output = await this.ollamaService.generateOutput(input, contextSearch);
    return {contextSearch, keywordSearch};
  }

  @Post('resetDb')
  async resetDb() {
    const context = await this.chromaService.resetDb();
    return context;
  }

  @Post('')
  async txt() {
    let text;

    let chunks = await this.chunkText(text, 3000)

    console.log(chunks.length)
    let documentIds=[];
    let documents = [];
    let i=1;
    for(const chunk in chunks){
      documentIds.push("chunk"+i++)
      documents.push(chunks[0])
    }

    await this.chromaService.addDocuments(documents, documentIds);


    return ;
  }

  async chunkText(text, size) {

    const numChunks = Math.ceil(text.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = text.substr(o, size);
    }

    return chunks;
  }
}
