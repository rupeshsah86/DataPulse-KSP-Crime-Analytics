'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, User, Bot, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const RAGChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState<string>(() => `chat-${Date.now()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Example questions for quick access
    const exampleQuestions = [
        'How many crimes are in Bangalore?',
        'What are the most common crime categories?',
        'Show me critical crimes',
        'Which district has the most crimes?',
    ];

    const sendMessage = async (question?: string) => {
        const messageToSend = question || input.trim();
        if (!messageToSend) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: messageToSend,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: messageToSend,
                    session_id: sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: data.answer || 'Sorry, I could not find an answer to your question.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Failed to get response from AI. Make sure the AI service is running.');

            // Add error message
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: '⚠️ Sorry, I could not process your request. Please make sure the AI service is running on port 8000.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white rounded-t-xl">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">AI Crime Assistant</h3>
                    <p className="text-xs text-gray-500">Ask questions about crime data</p>
                </div>
                <span className="text-xs text-gray-400 ml-auto">
                    {messages.length > 0 ? `${messages.length} messages` : 'Ready'}
                </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-600 font-medium">Ask me about crime data!</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Try asking about crime statistics, categories, or districts
                        </p>

                        {/* Example Questions */}
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {exampleQuestions.map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() => sendMessage(q)}
                                    className="text-xs bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 px-3 py-1.5 rounded-full transition-colors text-gray-600"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                            {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                ? 'bg-primary-500 text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                            }`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-200' : 'text-gray-400'
                                }`}>
                                {message.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                                <span className="text-sm text-gray-500">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask about crime data..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        className="flex-1"
                    />
                    <Button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        size="sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    Powered by Gemini AI • Analyzes crime records
                </p>
            </div>
        </div>
    );
};