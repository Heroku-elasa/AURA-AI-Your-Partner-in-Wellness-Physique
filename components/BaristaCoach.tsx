import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, Message } from '../types';

interface AICoachChatPageProps {
  chatHistory: Message[];
  isStreaming: boolean;
  onSendMessage: (message: string) => void;
}

const AICoachChatPage: React.FC<AICoachChatPageProps> = ({ chatHistory, isStreaming, onSendMessage }) => {
  const { t } = useLanguage();
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isStreaming]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isStreaming) {
      onSendMessage(userInput);
      setUserInput('');
    }
  };

  const renderMessage = (msg: Message, index: number) => {
    const isUser = msg.role === 'user';
    const isLastMessage = index === chatHistory.length - 1;
    const showTypingIndicator = isStreaming && isLastMessage && msg.role === 'model' && msg.parts[0].text === '';
    
    return (
      <div key={index} className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center border-2 border-teal-600">
             <svg className="h-5 w-5 text-teal-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3.5a1.5 1.5 0 011.396 2.21l-4.133 7.032a1.5 1.5 0 01-2.592-1.525L8.604 5.71A1.5 1.5 0 0110 3.5zM10 3.5a1.5 1.5 0 00-1.396 2.21l4.133 7.032a1.5 1.5 0 002.592-1.525L11.396 5.71A1.5 1.5 0 0010 3.5z" />
             </svg>
          </div>
        )}
        <div className={`max-w-xl p-4 rounded-2xl shadow-md ${isUser ? 'bg-teal-600 text-white rounded-br-lg' : 'bg-gray-700 text-gray-200 rounded-bl-lg'}`}>
          <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
            {msg.parts[0].text}
            {isStreaming && isLastMessage && !isUser && msg.parts[0].text !== '' && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>}
          </p>
           {showTypingIndicator && (
             <div className="flex items-center space-x-1 p-2">
                <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <section id="ai-coach" className="py-16 sm:py-24 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('aiCoach.title')}</h1>
          <p className="mt-4 text-lg text-gray-300">{t('aiCoach.subtitle')}</p>
        </div>

        <div className="mt-12 bg-gray-800/50 rounded-lg shadow-2xl backdrop-blur-sm border border-white/10 flex flex-col h-[70vh] max-h-[700px]">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {chatHistory.map(renderMessage)}
            <div ref={chatEndRef}></div>
          </div>

          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleSend} className="flex items-start gap-3">
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder={t('aiCoach.placeholder')}
                className="flex-grow bg-gray-700 border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white resize-none max-h-32"
                rows={1}
                disabled={isStreaming}
                aria-label={t('aiCoach.placeholder')}
              />
              <button 
                type="submit" 
                disabled={isStreaming || !userInput.trim()} 
                className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICoachChatPage;