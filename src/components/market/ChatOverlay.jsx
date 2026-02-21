
import React, { useState } from 'react';
import { Send, X, User } from 'lucide-react';

const ChatOverlay = ({ isOpen, onClose, driverName = "Driver" }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "مرحباً، أنا في طريقي للمتجر.", sender: "driver", time: "10:30" }
    ]);
    const [newMessage, setNewMessage] = useState("");

    if (!isOpen) return null;

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            text: newMessage,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage("");
    };

    return (
        <div className="fixed inset-0 z-[100] bg-neutral-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-[600px] rounded-t-[32px] sm:rounded-3xl flex flex-col shadow-2xl animate-slide-up overflow-hidden">
                {/* Header */}
                <div className="bg-primary-500 p-4 pt-6 flex items-center justify-between text-white shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-sm">{driverName}</h3>
                            <p className="text-[10px] text-primary-100 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                متصل الآن
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 bg-neutral-50 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-bold shadow-sm ${msg.sender === 'me'
                                    ? 'bg-primary-500 text-white rounded-tl-none'
                                    : 'bg-white text-neutral-800 border border-neutral-100 rounded-tr-none'
                                }`}>
                                <p>{msg.text}</p>
                                <span className={`text-[9px] mt-1 block opacity-70 ${msg.sender === 'me' ? 'text-primary-100' : 'text-neutral-400'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-neutral-100 flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالة..."
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-primary-500 transition-colors"
                    />
                    <button type="submit" className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100" disabled={!newMessage.trim()}>
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatOverlay;
