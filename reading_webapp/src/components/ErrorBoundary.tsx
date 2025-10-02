import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#f1f5f9',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '500px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚨</div>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
              Oops! Something went wrong
            </h2>
            <p style={{ 
              margin: '0 0 24px 0', 
              fontSize: '16px', 
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              The app encountered an unexpected error. This usually happens when there are 
              coding issues that need to be fixed.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#2563eb';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = '#3b82f6';
              }}
            >
              🔄 Reload App
            </button>
            
            {this.state.error && (
              <details style={{ 
                marginTop: '20px', 
                textAlign: 'left',
                fontSize: '12px',
                opacity: 0.7
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  Technical Details
                </summary>
                <pre style={{ 
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {this.state.error.message}
                  {this.state.error.stack && '\n\n' + this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
