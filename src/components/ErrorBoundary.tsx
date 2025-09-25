import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      const errorStack = this.state.error?.stack || '';
      const componentStack = this.state.errorInfo?.componentStack || '';
      
      const fullErrorMessage = `Error: ${errorMessage}\n\nStack Trace:\n${errorStack}\n\nComponent Stack:\n${componentStack}`;

      return (
        <div className="p-4">
          <Alert 
            variant="destructive" 
            showCopyButton={true}
            copyMessage={fullErrorMessage}
            className="relative"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p>{errorMessage}</p>
                <details className="text-sm opacity-75">
                  <summary className="cursor-pointer hover:opacity-100">
                    Show technical details
                  </summary>
                  <div className="mt-2 p-2 bg-muted rounded text-xs font-mono whitespace-pre-wrap">
                    {fullErrorMessage}
                  </div>
                </details>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;