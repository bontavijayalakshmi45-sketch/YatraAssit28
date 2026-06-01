import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Languages, Trash2, Loader2, Image, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Message, Language } from '../lib/supabase';

interface ChatMessage extends Message {
  image?: string;
}

export function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('english');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    const userMessage = input.trim();
    const imageToSend = selectedImage;
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    const tempUserMessage: ChatMessage = {
      id: 'temp-' + Date.now(),
      conversation_id: '',
      role: 'user',
      content: userMessage || (imageToSend ? 'What is in this image?' : ''),
      metadata: {},
      created_at: new Date().toISOString(),
      image: imageToSend || undefined
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/chat-agent`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage || 'What is in this image?', language, userId: user?.id, image: imageToSend }),
      });
      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        conversation_id: '',
        role: 'assistant',
        content: data.message || 'I apologize, but I could not process your request.',
        metadata: data.data || {},
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMessage.id), aiMessage]);
    } catch { setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id)); }
    finally { setIsLoading(false); }
  };

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hindi' ? 'hi-IN' : language === 'telugu' ? 'te-IN' : 'en-US';
      recognition.onresult = (event: any) => setInput(prev => prev + event.results[0][0].transcript);
      recognition.start();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Travel Assistant</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ask me anything about travel planning</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="english">English</option>
            <option value="hindi">हिंदी</option>
            <option value="telugu">తెలుగు</option>
          </select>
          <button onClick={() => setMessages([])} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"><Trash2 className="w-5 h-5 text-gray-600" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 mb-4">
        {messages.length === 0 && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-500/10 to-teal-500/10 flex items-center justify-center mb-4"><Languages className="w-10 h-10 text-saffron-500" /></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start a Conversation</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">Ask me about destinations, itineraries, budgets, or anything travel-related!</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {['Plan a 5-day trip to Rajasthan', 'Budget for Goa beach vacation', 'Best spiritual places in India', 'Heritage sites in Karnataka'].map((s) => (
                <button key={s} onClick={() => setInput(s)} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-left hover:bg-gray-100 dark:hover:bg-gray-950 border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-gradient-to-r from-saffron-500 to-teal-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                  {msg.image && <img src={msg.image} alt="Shared" className="max-w-full rounded-lg mb-2 max-h-60 object-cover" />}
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400 typing-dot" /><div className="w-2 h-2 rounded-full bg-gray-400 typing-dot" /><div className="w-2 h-2 rounded-full bg-gray-400 typing-dot" /></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Image preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mb-3 relative inline-block">
            <img src={imagePreview} alt="Preview" className="max-h-32 rounded-xl border border-gray-200 dark:border-gray-700" />
            <button onClick={removeImage} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-3">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current?.click()} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"><Image className="w-5 h-5 text-gray-600" /></motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startVoiceRecording} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"><Mic className="w-5 h-5 text-gray-600" /></motion.button>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Type your message..." rows={1} className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-saffron-500 resize-none" />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSend} disabled={(!input.trim() && !selectedImage) || isLoading} className="p-4 rounded-xl bg-gradient-to-r from-saffron-500 to-teal-500 text-white shadow-lg disabled:opacity-50">{isLoading ? <Loader2 className="w-5 h-5 spinner" /> : <Send className="w-5 h-5" />}</motion.button>
      </div>
    </div>
  );
}
