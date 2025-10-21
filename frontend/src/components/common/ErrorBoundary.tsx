import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
          <div className="card max-w-2xl w-full py-12 px-8 text-center space-y-6">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-child-xl font-black text-gray-900">Oops! Something went wrong</h1>
            <p className="text-child-base text-gray-700">
              Don't worry! Your progress is saved. Let's get you back on track.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-red-50 border-2 border-red-300 rounded-lg p-4 mt-4">
                <summary className="font-bold text-red-900 cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-child-xs text-red-800 space-y-2">
                  <p className="font-mono break-all">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="whitespace-pre-wrap overflow-auto max-h-64 bg-white p-2 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="primary"
                size="large"
                onClick={this.handleReset}
                aria-label="Go to dashboard"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => window.location.reload()}
                aria-label="Reload page"
              >
                Reload Page
              </Button>
            </div>

            <p className="text-child-xs text-gray-600 italic mt-6">
              If this keeps happening, try clearing your browser cache or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
