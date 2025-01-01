import { Module } from '@nestjs/common';
import { OllamaService } from './ollama/ollama.service';
import { ChromaService } from './chroma/chroma.service';
import { OllamaController } from './ollama/ollama.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Embedding, EmbeddingSchema } from './mongo/schemas/embedding.schema';
import { MongoService } from './mongo/mongo.service';
import { PineconeService } from './pinecode/pinecone.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://naveenneelamwip:Navya2211@cluster0.n39s9w2.mongodb.net/embeddings_db'),
    MongooseModule.forFeature([{ name: Embedding.name, schema: EmbeddingSchema }]),
  ],
  controllers: [OllamaController],
  providers: [MongoService, PineconeService, OllamaService, ChromaService],
})
export class AppModule {}
 