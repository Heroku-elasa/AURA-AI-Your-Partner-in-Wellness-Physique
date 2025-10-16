import React, { useState } from 'react';
import { useLanguage } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void; // Simulate login
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = t('validation.required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('validation.email');
      isValid = false;
    }

    if (!password) {
      newErrors.password = t('validation.required');
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t('validation.passwordLength');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onLogin();
    }
  };

  // Social Login Button component
  const SocialButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void; className?: string }> = ({ icon, text, onClick, className }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md text-sm font-medium transition-colors shadow-sm ${className}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-sm mx-4 border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 id="login-modal-title" className="text-xl font-bold">{t('loginModal.title')}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="p-8 space-y-6">
          {/* Social Logins */}
          <div className="space-y-3">
            <SocialButton
              onClick={onLogin}
              icon={<svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.417 44 30.618 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>}
              text={t('loginModal.google')}
              className="bg-white text-gray-700 hover:bg-gray-200"
            />
            <SocialButton
              onClick={onLogin}
              icon={<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.878A10.003 10.003 0 0022 12z"/></svg>}
              text={t('loginModal.facebook')}
              className="bg-[#1877F2] text-white hover:bg-[#166eab]"
            />
            <SocialButton
              onClick={onLogin}
              icon={<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>}
              text={t('loginModal.instagram')}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90"
            />
          </div>

          <div className="flex items-center text-xs text-gray-400">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4">{t('loginModal.or')}</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">{t('loginModal.emailPlaceholder')}</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(p => ({ ...p, email: '' }));
                }}
                placeholder={t('loginModal.emailPlaceholder')} 
                className={`w-full bg-gray-700 rounded-md p-3 focus:outline-none transition-colors ${errors.email ? 'border border-red-500 ring-2 ring-red-500/50' : 'border border-gray-600 focus:ring-2 focus:ring-brown-500'}`}
                required 
              />
              {errors.email && <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('loginModal.passwordPlaceholder')}</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(p => ({ ...p, password: '' }));
                }}
                placeholder={t('loginModal.passwordPlaceholder')} 
                className={`w-full bg-gray-700 rounded-md p-3 focus:outline-none transition-colors ${errors.password ? 'border border-red-500 ring-2 ring-red-500/50' : 'border border-gray-600 focus:ring-2 focus:ring-brown-500'}`}
                required 
              />
              {errors.password && <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.password}</p>}
            </div>
            <button type="submit" className="w-full py-3 bg-brown-600 text-white font-semibold rounded-md hover:bg-brown-700 transition-colors">
              {t('loginModal.loginButton')}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default LoginModal;