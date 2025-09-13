// Utility function to get TMDB API key with fallbacks
export const getApiKey = () => {
  // Primary: Vite environment variable
  const viteKey = import.meta.env.VITE_IMDB_APP_API_KEY;
  
  // Fallback: Direct environment access (for some deployment scenarios)
  const processKey = typeof process !== 'undefined' && process.env?.VITE_IMDB_APP_API_KEY;
  
  // Fallback: Window environment (if set globally)
  const windowKey = typeof window !== 'undefined' && window.VITE_IMDB_APP_API_KEY;
  
  // Hardcoded fallback for immediate testing (remove after fixing environment variables)
  const fallbackKey = '2e8b6be7ebee565f43dd82741f433c6f';
  
  const finalKey = viteKey || processKey || windowKey || fallbackKey;
  
  // Enhanced debug logging
  console.log('🔐 API Key Debug:', {
    viteKey: viteKey ? `${viteKey.substring(0, 8)}...` : 'MISSING',
    processKey: processKey ? `${processKey.substring(0, 8)}...` : 'MISSING',
    windowKey: windowKey ? `${windowKey.substring(0, 8)}...` : 'MISSING',
    finalKey: finalKey ? `${finalKey.substring(0, 8)}...` : 'MISSING',
    usingFallback: !viteKey && !processKey && !windowKey,
    environment: import.meta.env.MODE
  });
  
  // Debug logging
  if (!viteKey && finalKey === fallbackKey) {
    console.warn('⚠️ Using fallback API key. Please set VITE_IMDB_APP_API_KEY in environment variables.');
  }
  
  return finalKey;
};

// Centralized API URL builder
export const buildApiUrl = (endpoint, params = {}) => {
  const apiKey = getApiKey();
  const baseUrl = 'https://api.themoviedb.org/3';
  
  // Add api_key to params
  const urlParams = new URLSearchParams({
    api_key: apiKey,
    ...params
  });
  
  return `${baseUrl}${endpoint}?${urlParams.toString()}`;
};

// Common API fetch with error handling
export const apiRequest = async (endpoint, params = {}) => {
  const url = buildApiUrl(endpoint, params);
  
  try {
    console.log('🔍 API Request:', endpoint, params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success === false) {
      throw new Error(data.status_message || 'API returned an error');
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    throw error;
  }
};