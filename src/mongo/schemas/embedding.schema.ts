// schemas/embedding.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Embedding extends Document {
  @Prop()
  _id: string;
  
  @Prop()
  text: string;

  @Prop([Number])
  embeddings: number[];
}

export const EmbeddingSchema = SchemaFactory.createForClass(Embedding);
