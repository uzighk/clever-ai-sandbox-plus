
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Square, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Sparkles,
  User,
  Bot,
  Brain,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  aiProvider?: string;
  tokens?: number;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string, model: string, aiProvider: string) => void;
  isLoading: boolean;
  currentModel: string;
  currentAiProvider: string;
  onModelChange: (model: string) => void;
  onAiProviderChange: (provider: string) => void;
}

const aiProviders = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    icon: Sparkles,
    models: [
      { id: 'gpt-4', name: 'GPT-4', description: 'Mais inteligente' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Mais rápido' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5', description: 'Econômico' },
    ]
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    icon: Brain,
    models: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Mais capaz' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanceado' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Mais rápido' },
    ]
  },
  { 
    id: 'google', 
    name: 'Google', 
    icon: Zap,
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Avançado' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Com visão' },
    ]
  }
];

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  currentModel, 
  currentAiProvider,
  onModelChange,
  onAiProviderChange
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentProvider = aiProviders.find(p => p.id === currentAiProvider);
  const availableModels = currentProvider?.models || [];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim(), currentModel, currentAiProvider);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência",
    });
  };

  const formatContent = (content: string) => {
    // Simples formatação de markdown
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
  };

  return (
    <div className="flex flex-col h-full">
      {/* AI Provider and Model Selector */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Provedor de IA
            </label>
            <Select value={currentAiProvider} onValueChange={onAiProviderChange}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Selecione o provedor" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                {aiProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      <provider.icon className="h-4 w-4" />
                      {provider.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {availableModels.map((model) => (
            <Button
              key={model.id}
              variant={currentModel === model.id ? "default" : "outline"}
              size="sm"
              onClick={() => onModelChange(model.id)}
              className={cn(
                "flex-shrink-0 transition-all",
                currentModel === model.id 
                  ? "gradient-primary text-white" 
                  : "glass hover:bg-white/10"
              )}
            >
              {currentProvider?.icon && <currentProvider.icon className="h-3 w-3 mr-1" />}
              {model.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {model.description}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bem-vindo ao NexusAI Pro</h3>
              <p className="text-muted-foreground mb-6">
                Como posso ajudá-lo hoje? Faça uma pergunta ou escolha um dos exemplos abaixo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  "Escreva um código Python para análise de dados",
                  "Crie um plano de marketing para minha startup",
                  "Explique conceitos de IA de forma simples",
                  "Gere ideias criativas para um projeto"
                ].map((suggestion, index) => (
                  <Card
                    key={index}
                    className="p-4 glass hover:bg-white/5 cursor-pointer transition-all group"
                    onClick={() => setInput(suggestion)}
                  >
                    <p className="text-sm group-hover:text-purple-500 transition-colors">
                      {suggestion}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-slide-up",
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[80%] space-y-2",
                  message.type === 'user' ? 'items-end' : 'items-start'
                )}>
                  <Card className={cn(
                    "p-4 glass",
                    message.type === 'user' 
                      ? 'gradient-primary text-white ml-auto' 
                      : 'border-white/20'
                  )}>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: formatContent(message.content) 
                      }}
                    />
                  </Card>
                  
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.aiProvider && (
                      <Badge variant="outline" className="text-xs">
                        {aiProviders.find(p => p.id === message.aiProvider)?.name}
                      </Badge>
                    )}
                    {message.model && (
                      <Badge variant="outline" className="text-xs">
                        {message.model}
                      </Badge>
                    )}
                    {message.tokens && (
                      <Badge variant="outline" className="text-xs">
                        {message.tokens} tokens
                      </Badge>
                    )}
                    
                    <div className="flex gap-1 ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-white/10"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {message.type === 'assistant' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-green-500/20 text-green-500"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-red-500/20 text-red-500"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-blue-500/20 text-blue-500"
                            onClick={() => onSendMessage(`Reformule: ${message.content}`, currentModel, currentAiProvider)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <Card className="p-4 glass border-white/20">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    Pensando...
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem aqui... (Shift + Enter para nova linha)"
              className="min-h-[60px] max-h-32 resize-none glass border-white/20 pr-24 py-4 focus:ring-2 focus:ring-purple-500/50"
              disabled={isLoading}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white/10"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse-glow" 
                    : "hover:bg-white/10"
                )}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 gradient-primary text-white hover:opacity-90 disabled:opacity-50"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>IA: {currentProvider?.name}</span>
              <span>Modelo: {availableModels.find(m => m.id === currentModel)?.name}</span>
              <span>Caracteres: {input.length}</span>
            </div>
            <span>Pressione Enter para enviar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
