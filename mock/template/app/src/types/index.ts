// Common application types

// Common UI types
export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'sm' | 'base' | 'lg';
  reducedMotion: boolean;
}

export interface UserPreferences {
  theme: ThemeConfig;
  enableAnalytics: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}