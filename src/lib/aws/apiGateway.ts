import axios from 'axios';

export class ApiGatewayService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.AWS_API_GATEWAY_URL || '';
  }

  async invoke(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    payload: any = {}
  ) {
    try {
      const response = await axios({
        method: method.toLowerCase(),
        url: `${this.baseURL}${path}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Gateway invoke error:', error);
      throw error;
    }
  }
}
