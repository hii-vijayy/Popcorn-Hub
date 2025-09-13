import { useState } from 'react';
import { getApiKey, apiRequest } from '../utils/api';

const EnvChecker = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testApiKey = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const data = await apiRequest('/discover/movie', {
        sort_by: 'popularity.desc',
        page: 1
      });
      
      setTestResult({
        success: true,
        message: `✅ API Key works! Found ${data.results?.length || 0} movies`,
        details: data.results?.[0]?.title || 'No movie title'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ API Key test failed: ${error.message}`,
        details: error.toString()
      });
    } finally {
      setTesting(false);
    }
  };

  const apiKey = getApiKey();
  const envInfo = {
    viteApiKey: import.meta.env.VITE_IMDB_APP_API_KEY,
    allViteEnv: import.meta.env,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    isProd: import.meta.env.PROD,
    nodeEnv: import.meta.env.NODE_ENV,
    finalApiKey: apiKey,
    userAgent: navigator.userAgent,
    location: window.location.href
  };

  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '12px'
        }}
      >
        Debug Env
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      fontSize: '12px',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0 }}>Environment Debug</h4>
        <div>
          <button 
            onClick={testApiKey}
            disabled={testing}
            style={{
              background: testing ? '#666' : '#28a745',
              border: 'none',
              color: 'white',
              cursor: testing ? 'not-allowed' : 'pointer',
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: '3px',
              marginRight: '8px'
            }}
          >
            {testing ? 'Testing...' : 'Test API'}
          </button>
          <button 
            onClick={() => setShowDebug(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      </div>
      
      {testResult && (
        <div style={{
          backgroundColor: testResult.success ? '#28a745' : '#dc3545',
          padding: '8px',
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '11px'
        }}>
          <div>{testResult.message}</div>
          {testResult.details && (
            <div style={{ opacity: 0.8, marginTop: '4px' }}>
              {testResult.details}
            </div>
          )}
        </div>
      )}
      
      <div>
        <strong>API Key Status:</strong> {envInfo.viteApiKey ? '✅ Found' : '❌ Missing'}
      </div>
      
      <div>
        <strong>Final API Key:</strong> {envInfo.finalApiKey ? `${envInfo.finalApiKey.substring(0, 8)}...` : '❌ None'}
      </div>
      
      {envInfo.viteApiKey && (
        <div>
          <strong>Vite API Key:</strong> {envInfo.viteApiKey.substring(0, 8)}...
        </div>
      )}
      
      <div>
        <strong>Mode:</strong> {envInfo.mode}
      </div>
      
      <div>
        <strong>Environment:</strong> {envInfo.isDev ? 'Development' : 'Production'}
      </div>
      
      <div>
        <strong>Location:</strong> {envInfo.location}
      </div>
      
      <div>
        <strong>User Agent:</strong> {envInfo.userAgent.substring(0, 50)}...
      </div>
      
      <div>
        <strong>All Vite Env Keys:</strong>
        <div style={{ marginLeft: '10px', marginTop: '5px' }}>
          {Object.keys(envInfo.allViteEnv).map(key => (
            <div key={key}>
              {key}: {envInfo.allViteEnv[key] ? '✅' : '❌'}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
        Build Time: {new Date().toISOString()}
      </div>
    </div>
  );
};

export default EnvChecker;
