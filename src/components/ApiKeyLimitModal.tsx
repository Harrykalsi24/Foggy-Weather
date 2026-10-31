import React, { useState } from 'react';
import { KeyRound, ExternalLink, Check, AlertCircle, ShieldAlert, X } from 'lucide-react';
import { ThemeMode } from '../types/weather';
import { saveUserApiKey, MAX_DEFAULT_SEARCHES } from '../services/weatherService';

interface ApiKeyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
  theme?: ThemeMode;
}

export const ApiKeyLimitModal: React.FC<ApiKeyLimitModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
  theme = 'dark',
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    if (!trimmed || trimmed.length < 16) {
      setError('Please enter a valid OpenWeatherMap API key (typically 32 characters).');
      return;
    }

    saveUserApiKey(trimmed);
    setError('');
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onKeySaved(trimmed);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl relative transition-all ${
          isDark
            ? 'bg-[#0f172a] border-slate-700/80 text-white shadow-blue-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-1.5">Free Search Limit Reached</h3>
        <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          You have used all <strong className="text-amber-500 font-semibold">{MAX_DEFAULT_SEARCHES} free location searches</strong> included with the starter quota. To unlock unlimited weather searches, please enter your own free OpenWeatherMap API key.
        </p>

        {/* Claim Free Key Card */}
        <div
          className={`p-3.5 rounded-2xl border mb-5 flex items-center justify-between gap-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold">Need an API key?</p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Takes 1 minute & 100% free</p>
            </div>
          </div>
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <span>Claim Free Key</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Key Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Your OpenWeatherMap API Key
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste your 32-character API key"
              autoFocus
              className={`w-full h-11 px-3.5 rounded-xl text-xs font-mono border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 h-10 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Key Activated!</span>
                </>
              ) : (
                <span>Activate & Continue</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
