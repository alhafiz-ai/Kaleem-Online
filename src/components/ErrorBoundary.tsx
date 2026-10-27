import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Kaleem Online Academy caught an unhandled error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950 border border-amber-400 flex items-center justify-center text-3xl">
              🕌
            </div>

            <h1 className="text-xl font-bold font-kufi text-amber-300">
              کلیم آن لائن اکیڈمی — Kaleem Online Academy
            </h1>
            <p className="text-xs text-stone-300 leading-relaxed font-nastaliq" dir="rtl">
              صفحہ لوڈ کرتے وقت ایک عارضی مسئلہ پیش آیا ہے۔ آپ نیچے دیے گئے بٹن پر کلک کر کے صفحہ دوبارہ لوڈ کر سکتے ہیں۔
            </p>
            <p className="text-xs text-stone-400">
              An unexpected display issue occurred. Please refresh or reset stored session data.
            </p>

            {this.state.error && (
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] font-mono text-stone-400 text-left max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs shadow transition-all cursor-pointer"
              >
                صفحہ دوبارہ لوڈ کریں (Reload)
              </button>
              <button
                onClick={this.handleResetAndReload}
                className="py-3 px-4 rounded-xl font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs border border-stone-700 transition-all cursor-pointer"
              >
                ری سیٹ ڈیٹا (Reset)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
