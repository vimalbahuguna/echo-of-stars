import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare,
  Mic,
  Send,
  Brain,
  Sparkles,
  Bot,
  User
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIOracle = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to the AI Oracle! I'm here to provide cosmic insights and guidance. Ask me about your future, relationships, career, or any astrological questions.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const responses = [
      "The stars whisper that great opportunities await you. Venus is aligned in your favor, bringing harmony to your relationships and creative endeavors. Trust your intuition this week.",
      "Your cosmic energy suggests a period of transformation. Mars is activating your career sector, indicating bold moves and leadership opportunities are on the horizon.",
      "The lunar cycles indicate emotional clarity is coming. Your intuitive powers are heightened now - pay attention to your dreams and synchronicities.",
      "Jupiter's influence brings expansion and growth to your path. This is an excellent time for learning, travel, or expanding your horizons in meaningful ways.",
      "Mercury retrograde suggests slowing down to reflect. Review your goals and communication patterns - clarity will emerge after this introspective period."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

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
                AI Oracle
              </CardTitle>
              <p className="text-sm text-muted-foreground">Your cosmic AI companion</p>
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
                <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-muted/50 text-muted-foreground p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
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
                placeholder="Ask the Oracle anything about your cosmic destiny..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-input/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 pr-12"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                size="sm"
                className="absolute right-1 top-1 bg-gradient-nebula hover:shadow-glow-accent"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ask about love, career, future predictions, or spiritual guidance
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIOracle;