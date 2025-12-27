import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Oops! Something went wrong</CardTitle>
              <CardDescription>
                The application encountered an unexpected error
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-mono text-muted-foreground break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReload} className="flex-1">
                  Reload Page
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                If this problem persists, please contact support
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
