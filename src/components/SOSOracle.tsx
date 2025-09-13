import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare,
  Mic,
  Send,
  Brain,
  Sparkles,
  Bot,
  User,
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SOSOracle = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to SOS Oracle! I'm your advanced AI astrologer and cosmic guide. I have deep knowledge of both Western and Vedic astrology. Ask me about your birth chart, planetary transits, relationships, career, or any spiritual guidance you seek.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log('Sending message to AI chat...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentMessage,
          conversationId: conversationId
        }
      });

      if (error) {
        console.error('Error calling AI chat:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      console.log('AI chat response:', data);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Set conversation ID for future messages
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I apologize, but I'm having trouble connecting to the cosmic energies right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach SOS Oracle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Load conversation history when component mounts
  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get most recent conversation
        const { data: conversations } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (conversations && conversations[0]) {
          const conversationId = conversations[0].id;
          setConversationId(conversationId);

          // Load recent messages
          const { data: chatMessages } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .limit(20);

          if (chatMessages && chatMessages.length > 0) {
            const loadedMessages: Message[] = chatMessages.map(msg => ({
              id: msg.id,
              content: msg.message_content,
              sender: msg.sender_type as 'user' | 'ai',
              timestamp: new Date(msg.created_at)
            }));

            setMessages(prev => [prev[0], ...loadedMessages]); // Keep welcome message
          }
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    };

    loadConversationHistory();
  }, []);

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("What does my future hold?");
      }, 2000);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] bg-card/50 border-accent/20 shadow-cosmic">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-accent animate-pulse-glow" />
              <Sparkles className="absolute inset-0 h-8 w-8 text-primary animate-twinkle" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-nebula bg-clip-text text-transparent">
                SOS Oracle
              </CardTitle>
              <p className="text-sm text-muted-foreground">Your advanced AI astrologer</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2" />
            Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full">
        {/* Chat Messages */}
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary/10 text-primary-foreground ml-auto'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-muted/50 text-muted-foreground p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-sm">SOS Oracle is consulting the cosmos...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border/40 p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoiceInput}
              className={`border-secondary/50 hover:bg-secondary/10 ${
                isListening ? 'bg-secondary/20 border-secondary' : ''
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Ask SOS Oracle about your chart, relationships, career, or spiritual guidance..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                disabled={isTyping}
                className="bg-input/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 pr-12 disabled:opacity-50"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="absolute right-1 top-1 bg-gradient-nebula hover:shadow-glow-accent disabled:opacity-50"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ask about astrological insights, birth chart analysis, or cosmic guidance
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SOSOracle;