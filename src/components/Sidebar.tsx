
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Image,
  FileText,
  Lightbulb,
  Zap,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  isOpen: boolean;
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

const Sidebar = ({ 
  isOpen, 
  chats, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  onRenameChat 
}: SidebarProps) => {
  const features = [
    { icon: MessageSquare, label: 'Chat Inteligente', description: 'Conversas avançadas' },
    { icon: Image, label: 'Geração de Imagens', description: 'DALL-E Integration' },
    { icon: FileText, label: 'Análise de Documentos', description: 'Upload e análise' },
    { icon: Lightbulb, label: 'Templates', description: 'Prompts predefinidos' },
    { icon: Zap, label: 'Modo Rápido', description: 'Respostas instantâneas' },
    { icon: BarChart3, label: 'Analytics', description: 'Estatísticas de uso' },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full w-80 glass border-r border-white/10 transform transition-transform duration-300 z-40",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-4 border-b border-white/10">
        <Button 
          onClick={onNewChat}
          className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Conversas Recentes
          </h3>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5",
                currentChatId === chat.id && "bg-white/10 border border-white/20"
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {chat.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTitle = prompt('Novo título:', chat.title);
                      if (newTitle) onRenameChat(chat.id, newTitle);
                    }}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-red-500/20 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground">Recursos</h4>
          <div className="grid grid-cols-2 gap-2">
            {features.slice(0, 4).map((feature) => (
              <div
                key={feature.label}
                className="p-2 rounded-lg glass hover:bg-white/5 cursor-pointer transition-all group"
              >
                <feature.icon className="h-4 w-4 text-purple-500 mb-1" />
                <p className="text-xs font-medium">{feature.label}</p>
                <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
