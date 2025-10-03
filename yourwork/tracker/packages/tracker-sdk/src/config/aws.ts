// AWS Configuration for SDK

export interface AWSConfig {
  apiEndpoint: string;
  apiKey?: string;
  region?: string;
}

export const defaultAWSConfig: AWSConfig = {
  apiEndpoint: 'http://localhost:3001',
  region: 'ap-northeast-1',
};

// Helper to build API headers for AWS
export const buildAWSHeaders = (apiKey?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  return headers;
};

// Check if endpoint is AWS API Gateway
export const isAWSEndpoint = (endpoint: string): boolean => {
  return endpoint.includes('execute-api.amazonaws.com');
};