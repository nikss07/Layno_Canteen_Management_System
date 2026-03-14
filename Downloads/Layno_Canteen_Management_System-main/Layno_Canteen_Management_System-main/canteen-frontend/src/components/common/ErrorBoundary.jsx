
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-4 animate-bounce">💥</div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>
            <p className="text-red-400 text-sm mb-6 bg-red-100 p-3 rounded-xl font-mono">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-md"
            >
              🔄 Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}