// Dynamic configuration loader for dashboard
// This allows the dashboard to fetch configuration from S3 at runtime

interface DynamicConfig {
  apiEndpoint: string;
  apiKey: string;
  region: string;
  environment: string;
}

let cachedConfig: DynamicConfig | null = null;

export async function loadDynamicConfig(): Promise<DynamicConfig> {
  // If config is already cached, return it
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // Try to fetch config.json from the same CloudFront distribution
    const response = await fetch('/config/config.json');
    
    if (response.ok) {
      const config = await response.json();
      cachedConfig = config;
      console.log('Loaded dynamic configuration from S3:', config);
      return config;
    }
  } catch (error) {
    console.warn('Failed to load dynamic config, falling back to env variables:', error);
  }

  // Fallback to environment variables
  cachedConfig = {
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '',
    apiKey: import.meta.env.VITE_API_KEY || '',
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    environment: import.meta.env.VITE_ENVIRONMENT || 'local',
  };

  return cachedConfig;
}

// Update AWS config to use dynamic configuration
export async function getApiConfig() {
  const config = await loadDynamicConfig();
  return {
    apiEndpoint: config.apiEndpoint,
    apiKey: config.apiKey,
    environment: config.environment,
    region: config.region,
  };
}

// Update API headers with dynamic config
export async function getDynamicApiHeaders(): Promise<Record<string, string>> {
  const config = await loadDynamicConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers['x-api-key'] = config.apiKey;
  }

  return headers;
}