import { useState } from 'react';

const EnvChecker = () => {
  const [showDebug, setShowDebug] = useState(false);

  const envInfo = {
    viteApiKey: import.meta.env.VITE_IMDB_APP_API_KEY,
    allViteEnv: import.meta.env,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    isProd: import.meta.env.PROD,
    nodeEnv: import.meta.env.NODE_ENV
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
      
      <div>
        <strong>API Key Status:</strong> {envInfo.viteApiKey ? '✅ Found' : '❌ Missing'}
      </div>
      
      {envInfo.viteApiKey && (
        <div>
          <strong>API Key:</strong> {envInfo.viteApiKey.substring(0, 8)}...
        </div>
      )}
      
      <div>
        <strong>Mode:</strong> {envInfo.mode}
      </div>
      
      <div>
        <strong>Environment:</strong> {envInfo.isDev ? 'Development' : 'Production'}
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
