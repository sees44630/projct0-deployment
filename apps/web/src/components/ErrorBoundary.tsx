'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 font-mono">
          <h1 className="text-3xl font-bold text-red-500 mb-4">System Critical Failure</h1>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 max-w-4xl w-full overflow-auto">
            <h2 className="text-xl mb-2 text-yellow-400">Error Message:</h2>
            <pre className="mb-4 whitespace-pre-wrap break-words text-red-300">
              {this.state.error && this.state.error.toString()}
            </pre>
            <h2 className="text-xl mb-2 text-yellow-400">Stack Trace:</h2>
            <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-x-auto">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button
            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            onClick={() => window.location.reload()}
          >
            Reboot System (Reload)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
