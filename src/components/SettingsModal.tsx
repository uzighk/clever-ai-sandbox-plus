
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Key, Brain, Palette, Bell, Shield, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const SettingsModal = ({ isOpen, onClose, apiKey, onApiKeyChange }: SettingsModalProps) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [systemPrompt, setSystemPrompt] = useState('Você é um assistente útil e inteligente.');
  const [temperature, setTemperature] = useState([0.7]);
  const [max_tokens, setMaxTokens] = useState([2048]);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    onApiKeyChange(tempApiKey);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] glass border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            Configurações do NexusAI Pro
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              IA
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Interface
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4 mt-6">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-purple-500" />
                  Configurações da API OpenAI
                </CardTitle>
                <CardDescription>
                  Configure sua chave de API para acessar os modelos GPT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-key">Chave da API OpenAI</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="glass border-white/20 mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Sua chave é armazenada localmente e nunca é enviada para nossos servidores
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="glass border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Status da API</span>
                      </div>
                      <Badge variant={apiKey ? "default" : "destructive"}>
                        {apiKey ? "Conectado" : "Não configurado"}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Modelos Disponíveis</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">GPT-4</Badge>
                        <Badge variant="outline">GPT-3.5</Badge>
                        <Badge variant="outline">DALL-E</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-6">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle>Configurações de IA</CardTitle>
                <CardDescription>
                  Personalize o comportamento dos modelos de IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="system-prompt">Prompt do Sistema</Label>
                  <Textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Defina como a IA deve se comportar..."
                    className="glass border-white/20 mt-2 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Temperatura: {temperature[0]}</Label>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      max={2}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Controla a criatividade das respostas
                    </p>
                  </div>

                  <div>
                    <Label>Tokens Máximos: {max_tokens[0]}</Label>
                    <Slider
                      value={max_tokens}
                      onValueChange={setMaxTokens}
                      max={4096}
                      min={256}
                      step={256}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Limite de tamanho das respostas
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Modo Criativo', desc: 'Respostas mais criativas e variadas' },
                    { name: 'Modo Preciso', desc: 'Respostas mais factuais e diretas' },
                    { name: 'Modo Balanceado', desc: 'Equilibrio entre criatividade e precisão' }
                  ].map((mode) => (
                    <Card key={mode.name} className="glass border-white/10 cursor-pointer hover:bg-white/5">
                      <CardContent className="p-4 text-center">
                        <h4 className="font-medium mb-1">{mode.name}</h4>
                        <p className="text-xs text-muted-foreground">{mode.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interface" className="space-y-4 mt-6">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle>Personalização da Interface</CardTitle>
                <CardDescription>
                  Configure a aparência e comportamento da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar tema escuro automaticamente
                    </p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-salvamento</Label>
                    <p className="text-sm text-muted-foreground">
                      Salvar conversas automaticamente
                    </p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div>
                  <Label className="mb-3 block">Temas Disponíveis</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { name: 'Roxo', class: 'from-purple-500 to-blue-500' },
                      { name: 'Verde', class: 'from-green-500 to-teal-500' },
                      { name: 'Rosa', class: 'from-pink-500 to-rose-500' },
                      { name: 'Laranja', class: 'from-orange-500 to-red-500' },
                    ].map((theme) => (
                      <Card key={theme.name} className="glass border-white/10 cursor-pointer hover:bg-white/5">
                        <CardContent className="p-3 text-center">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.class} mx-auto mb-2`} />
                          <p className="text-xs font-medium">{theme.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Gerencie quando e como receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Notificações Desktop', desc: 'Receber notificações no desktop quando a IA responder' },
                  { title: 'Sons de Notificação', desc: 'Reproduzir sons quando receber mensagens' },
                  { title: 'Notificações de Erro', desc: 'Alertas quando ocorrerem erros na API' },
                  { title: 'Atualizações do Sistema', desc: 'Notificações sobre novas funcionalidades' },
                ].map((setting) => (
                  <div key={setting.title} className="flex items-center justify-between">
                    <div>
                      <Label>{setting.title}</Label>
                      <p className="text-sm text-muted-foreground">{setting.desc}</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-6">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle>Privacidade e Segurança</CardTitle>
                <CardDescription>
                  Configure suas preferências de privacidade e segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="glass border-white/10">
                    <CardContent className="p-4">
                      <Shield className="h-8 w-8 text-green-500 mb-3" />
                      <h4 className="font-medium mb-2">Dados Locais</h4>
                      <p className="text-sm text-muted-foreground">
                        Todas as conversas são armazenadas localmente no seu navegador
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/10">
                    <CardContent className="p-4">
                      <Key className="h-8 w-8 text-blue-500 mb-3" />
                      <h4 className="font-medium mb-2">API Segura</h4>
                      <p className="text-sm text-muted-foreground">
                        Conexões criptografadas com a API da OpenAI
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start glass border-white/20">
                    Limpar Histórico de Conversas
                  </Button>
                  <Button variant="outline" className="w-full justify-start glass border-white/20">
                    Exportar Dados Pessoais
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Deletar Todos os Dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="glass border-white/20">
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
