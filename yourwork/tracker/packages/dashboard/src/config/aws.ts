// AWS Configuration for Dashboard

export const awsConfig = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001',
  apiKey: import.meta.env.VITE_API_KEY || '',
  environment: import.meta.env.VITE_ENVIRONMENT || 'local',
  region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
};

// API client configuration for AWS
export const getApiHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (awsConfig.apiKey) {
    headers['x-api-key'] = awsConfig.apiKey;
  }

  return headers;
};

// Check if running in AWS
export const isAWSEnvironment = (): boolean => {
  return awsConfig.environment !== 'local' && awsConfig.apiEndpoint.includes('amazonaws.com');
};