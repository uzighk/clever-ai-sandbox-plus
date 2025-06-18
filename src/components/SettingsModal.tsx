
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Settings, 
  Brain, 
  Sparkles, 
  Zap, 
  ExternalLink,
  Eye,
  EyeOff 
} from 'lucide-react';

interface ApiKeys {
  openai: string;
  anthropic: string;
  google: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKeys;
  onApiKeysChange: (apiKeys: ApiKeys) => void;
}

const SettingsModal = ({ isOpen, onClose, apiKeys, onApiKeysChange }: SettingsModalProps) => {
  const [localApiKeys, setLocalApiKeys] = useState<ApiKeys>(apiKeys);
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false
  });

  const handleSave = () => {
    onApiKeysChange(localApiKeys);
    onClose();
  };

  const handleApiKeyChange = (provider: keyof ApiKeys, value: string) => {
    setLocalApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const toggleShowKey = (provider: keyof typeof showKeys) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const apiProviders = [
    {
      id: 'openai' as keyof ApiKeys,
      name: 'OpenAI',
      icon: Sparkles,
      description: 'GPT-4, GPT-3.5 Turbo e outros modelos da OpenAI',
      website: 'https://platform.openai.com/api-keys',
      status: localApiKeys.openai ? 'Configurado' : 'Não configurado',
      color: 'text-green-500'
    },
    {
      id: 'anthropic' as keyof ApiKeys,
      name: 'Anthropic',
      icon: Brain,
      description: 'Claude 3 Opus, Sonnet e Haiku',
      website: 'https://console.anthropic.com/',
      status: localApiKeys.anthropic ? 'Configurado' : 'Não configurado',
      color: 'text-orange-500'
    },
    {
      id: 'google' as keyof ApiKeys,
      name: 'Google AI',
      icon: Zap,
      description: 'Gemini Pro e Gemini Pro Vision',
      website: 'https://makersuite.google.com/app/apikey',
      status: localApiKeys.google ? 'Configurado' : 'Não configurado',
      color: 'text-blue-500'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" />
            Configurações
          </DialogTitle>
          <DialogDescription>
            Configure suas chaves de API para diferentes provedores de IA
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Chaves de API
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4 mt-6">
            <div className="space-y-4">
              {apiProviders.map((provider) => (
                <Card key={provider.id} className="glass border-white/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                          <provider.icon className={`h-5 w-5 ${provider.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{provider.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {provider.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={localApiKeys[provider.id] ? "default" : "secondary"}>
                          {provider.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => window.open(provider.website, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <Label htmlFor={`${provider.id}-key`} className="text-sm font-medium">
                        Chave da API
                      </Label>
                      <div className="relative">
                        <Input
                          id={`${provider.id}-key`}
                          type={showKeys[provider.id] ? "text" : "password"}
                          placeholder={`Digite sua chave da API ${provider.name}`}
                          value={localApiKeys[provider.id]}
                          onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                          className="glass border-white/20 pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-8 w-8 hover:bg-white/10"
                          onClick={() => toggleShowKey(provider.id)}
                        >
                          {showKeys[provider.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">💡 Dica de Segurança</h4>
              <p className="text-sm text-muted-foreground">
                Suas chaves de API são armazenadas localmente no seu navegador e nunca são enviadas para nossos servidores. 
                Mantenha suas chaves seguras e não as compartilhe com terceiros.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle>Preferências Gerais</CardTitle>
                <CardDescription>
                  Personalize sua experiência com o NexusAI Pro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    O tema escuro está ativo por padrão. Use o botão no cabeçalho para alternar.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Modelo Padrão</Label>
                  <p className="text-sm text-muted-foreground">
                    O modelo padrão é selecionado automaticamente baseado no provedor de IA escolhido.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Exportação de Conversas</Label>
                  <p className="text-sm text-muted-foreground">
                    Suas conversas podem ser exportadas em formato JSON através do menu do usuário.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={onClose} className="glass hover:bg-white/10">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gradient-primary text-white">
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
