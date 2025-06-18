
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import SettingsModal from '@/components/SettingsModal';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  tokens?: number;
}

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || '');
  const [currentModel, setCurrentModel] = useState('gpt-4');
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  useEffect(() => {
    // Carregar chats do localStorage
    const savedChats = localStorage.getItem('nexus-chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    }
  }, []);

  useEffect(() => {
    // Salvar chats no localStorage
    if (chats.length > 0) {
      localStorage.setItem('nexus-chats', JSON.stringify(chats));
    }
  }, [chats]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai-api-key', key);
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      timestamp: new Date(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setSidebarOpen(false);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  const sendMessage = async (content: string, model: string) => {
    if (!apiKey) {
      toast({
        title: "API Key necessária",
        description: "Configure sua chave da API OpenAI nas configurações",
        variant: "destructive",
      });
      setSettingsOpen(true);
      return;
    }

    let chatId = currentChatId;
    
    // Criar novo chat se não existir
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.slice(0, 50) + '...',
        timestamp: new Date(),
        messages: []
      };
      setChats(prev => [newChat, ...prev]);
      chatId = newChat.id;
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    // Adicionar mensagem do usuário
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));

    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'Você é um assistente de IA útil, inteligente e amigável. Responda de forma clara e informativa.' },
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
        model: model,
        tokens: data.usage?.total_tokens
      };

      // Adicionar resposta da IA
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));

      // Atualizar título do chat se for o primeiro
      if (messages.length === 0) {
        setChats(prev => prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, title: content.slice(0, 50) + (content.length > 50 ? '...' : '') }
            : chat
        ));
      }

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast({
        title: "Erro na API",
        description: "Falha ao enviar mensagem. Verifique sua chave de API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    if (!currentChat) return;
    
    const chatData = {
      title: currentChat.title,
      timestamp: currentChat.timestamp,
      messages: currentChat.messages
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChat.title.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat exportado!",
      description: "O arquivo foi baixado com sucesso",
    });
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex w-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={createNewChat}
          onSelectChat={setCurrentChatId}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
        />

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "lg:ml-80" : "ml-0"
        )}>
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onShowHistory={() => setSidebarOpen(true)}
            onShowSettings={() => setSettingsOpen(true)}
            onExportChat={exportChat}
          />

          <main className="flex-1 overflow-hidden">
            <ChatInterface
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              currentModel={currentModel}
              onModelChange={setCurrentModel}
            />
          </main>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          apiKey={apiKey}
          onApiKeyChange={handleApiKeyChange}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
