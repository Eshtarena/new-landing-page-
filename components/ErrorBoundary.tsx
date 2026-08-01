import React from "react";
import { NextRouter } from "next/router";

interface ErrorBoundaryProps {
  router: NextRouter;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };
  private unregisterRouteChange?: () => void;

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled render error, falling back to recovery screen:", error, info.componentStack);
  }

  componentDidMount() {
    const resetOnNavigation = () => {
      if (this.state.error) {
        this.setState({ error: null });
      }
    };
    this.props.router.events.on("routeChangeComplete", resetOnNavigation);
    this.unregisterRouteChange = () => {
      this.props.router.events.off("routeChangeComplete", resetOnNavigation);
    };
  }

  componentWillUnmount() {
    this.unregisterRouteChange?.();
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              This page hit an unexpected error. Please reload to continue.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center min-h-11 px-8 py-2.5 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-500/90 transition-colors duration-200 ease-spring"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
