import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OllamaService {
  private readonly baseUrl = 'http://localhost:11434/api';

  async getEmbeddings(input: string): Promise<any> {
    let response;
    try {
      response = await axios.post(`${this.baseUrl}/embed`, {
        model: 'mxbai-embed-large',
        input,
      });
    } catch (error) {
      console.log(error)
    }

    return response.data;
  }

  async generateOutput(prompt: string, context: any): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/generate`, {
      model: 'llama3.2',
      prompt,
      context,
    });
    return response.data;
  }
}
