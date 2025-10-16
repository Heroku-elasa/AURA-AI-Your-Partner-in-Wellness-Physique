import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onClose: (id: number) => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  error: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  success: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  info: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const STYLES: Record<ToastType, { bg: string; text: string; border: string }> = {
  error: { bg: 'bg-red-900/80', text: 'text-red-200', border: 'border-red-600/50' },
  success: { bg: 'bg-green-900/80', text: 'text-green-200', border: 'border-green-600/50' },
  info: { bg: 'bg-blue-900/80', text: 'text-blue-200', border: 'border-blue-600/50' },
};

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300); // Wait for animation
  };

  const style = STYLES[type];
  const icon = ICONS[type];

  return (
    <div
      role="alert"
      className={`
        w-full max-w-sm rounded-lg shadow-2xl backdrop-blur-md p-4 flex items-start gap-4 transition-all duration-300 ease-in-out
        ${style.bg} ${style.text} border ${style.border}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow text-sm font-medium">{message}</div>
      <button onClick={handleClose} className="flex-shrink-0 p-1 -m-1 rounded-full hover:bg-white/10" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}

export const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

    const addToast = (message: string, type: ToastType) => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div aria-live="assertive" className="fixed inset-0 pointer-events-none p-4 sm:p-6 flex flex-col items-end justify-start z-[100] gap-3">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
