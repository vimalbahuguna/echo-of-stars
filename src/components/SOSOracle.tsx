import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { 
  MessageSquare,
  Mic,
  Send,
  Brain,
  Sparkles,
  Bot,
  User,
  Loader2,
  UserPlus,
  Copy,
  Star,
  MapPin,
  Users,
  Eye,
  Zap,
  Save,
  Search,
  PlusCircle,
  XCircle
} from "lucide-react";
import { BirthData } from "@/types/birthData"; // Import the BirthData interface

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isError?: boolean;
}

const SOSOracle = () => {
  const { user } = useAuth();
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
  const [showDemo, setShowDemo] = useState(false);
  const [selectedChart, setSelectedChart] = useState<BirthData | null>(null);
  const [selectedSystem, setSelectedSystem] = useState('western');

  // Birth Data Management States
  const [savedCharts, setSavedCharts] = useState<BirthData[]>([]);
  const [editingChartId, setEditingChartId] = useState<number | null>(null);
  const [birthFormData, setBirthFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    relationship: 'Self',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSavingOrDeleting, setIsSavingOrDeleting] = useState(false);

  // Demo conversation data
  const demoMessages: Message[] = [
    {
      id: 'demo-1',
      content: "Welcome to SOS Oracle Demo! Here's a sample conversation to show how I can help with astrological insights.",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: 'demo-2',
      content: "What does it mean that my Sun is in Taurus?",
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: 'demo-3',
      content: "Having your Sun in Taurus means you have a grounded, practical nature with a strong appreciation for beauty, comfort, and stability. Taurus Suns are known for their reliability, determination, and methodical approach to life. You likely value security, enjoy sensual pleasures, and have a natural talent for building lasting foundations. However, you might also be quite stubborn when your values are challenged, and you prefer gradual change over sudden disruptions.",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: 'demo-4',
      content: "How will the upcoming Mercury retrograde affect me?",
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: 'demo-5',
      content: "Mercury retrograde typically brings opportunities for reflection, revision, and reconnection. Since Mercury governs communication and technology, you might experience some delays or miscommunications during this period. For your specific chart, I'd need your birth details to give more personalized insights about which areas of your life will be most affected. Generally, it's a great time to review projects, reconnect with old friends, and be extra careful with contracts and travel plans.",
      sender: 'ai',
      timestamp: new Date()
    }
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null); // Declared useRef

  const fetchSavedCharts = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('user_birth_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) {
        // Add astrologicalSystem property to match BirthData type
        const chartsWithSystem = data.map(chart => ({
          ...chart,
          astrologicalSystem: 'western' as const // Default to western
        }));
        setSavedCharts(chartsWithSystem as BirthData[]);
      }
      if (error) {
        console.error("Error fetching saved charts:", error);
        toast({ title: "Error", description: "Failed to load saved birth data.", variant: "destructive" });
      }
    } else {
      setSavedCharts([]);
    }
  };

  useEffect(() => {
    fetchSavedCharts();
  }, [user]);

  const filteredCharts = savedCharts.filter(chart =>
    chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chart.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chart.location && chart.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (chart.relationship && chart.relationship.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const loadChartForEdit = (chart: BirthData) => {
    setEditingChartId(chart.id || null);
    setBirthFormData({
      name: chart.name,
      date: chart.date,
      time: chart.time,
      location: chart.location,
      relationship: chart.relationship || 'Self',
    });
    toast({
      title: "Chart Loaded",
      description: `Chart "${chart.name}" has been loaded for editing.`,
    });
  };

  const clearBirthForm = () => {
    setEditingChartId(null);
    setBirthFormData({ name: '', date: '', time: '', location: '', relationship: 'Self' });
    toast({ title: "Form Cleared", description: "Birth data form has been reset." });
  };

  const handleSaveBirthData = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save your birth data.", variant: "destructive" });
      return;
    }
    if (!birthFormData.name || !birthFormData.date || !birthFormData.location) {
      toast({ title: "Missing Information", description: "Please fill in name, date, and location to save.", variant: "destructive" });
      return;
    }

    setIsSavingOrDeleting(true);
    try {
      // Get user's tenant_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!profile?.tenant_id) {
        throw new Error('User profile not found or missing tenant information');
      }

      const birthTime = birthFormData.time || '12:00';
      const chartData = {
        user_id: user.id,
        tenant_id: profile.tenant_id,
        name: birthFormData.name,
        date: birthFormData.date,
        time: birthTime,
        location: birthFormData.location,
        relationship: birthFormData.relationship,
      };

      let error;
      if (editingChartId) {
        // Update existing chart
        const { error: updateError } = await supabase
          .from('user_birth_data')
          .update({
            name: birthFormData.name,
            date: birthFormData.date,
            time: birthTime,
            location: birthFormData.location,
            relationship: birthFormData.relationship,
          })
          .eq('id', editingChartId)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Create new chart
        const { error: insertError } = await supabase
          .from('user_birth_data')
          .insert(chartData);
        error = insertError;
      }

      if (error) {
        console.error('Error saving birth data:', error);
        throw new Error(error.message);
      }

      await fetchSavedCharts(); // Refresh the list
      clearBirthForm(); // Reset editing state and clear form

      toast({ title: "Birth Data Saved!", description: `Chart "${birthFormData.name}" has been successfully saved.` });
    } catch (error) {
      toast({ title: "Save Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsSavingOrDeleting(false);
    }
  };

  const handleDeleteBirthData = async (chartId: number) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to delete your birth data.", variant: "destructive" });
      return;
    }

    setIsSavingOrDeleting(true);
    try {
      const { error } = await supabase
        .from('user_birth_data')
        .delete()
        .eq('id', chartId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting birth data:', error);
        throw new Error(error.message);
      }

      await fetchSavedCharts(); // Refresh the list
      clearBirthForm(); // Clear form if the deleted chart was being edited
      toast({ title: "Birth Data Deleted!", description: "The selected chart has been deleted." });
    } finally {
      setIsSavingOrDeleting(false);
    }
  };

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
          conversationId: conversationId,
          birthData: selectedChart ? {
            name: selectedChart.name,
            date: selectedChart.date,
            time: selectedChart.time,
            location: selectedChart.location,
          } : null,
          astrologicalSystem: selectedSystem,
          chartId: selectedChart?.id || null // Pass chart ID for conversation context
        }
      });

      // Detailed logging
      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Error calling AI chat:', error);
        if (error.message?.includes('Unauthorized') || error.message?.includes('JWT')) {
          throw new Error('Authentication error. Please sign in again to continue.');
        }
        // Check for function-specific errors from the backend
        if (data && data.success === false) {
          throw new Error(data.error || 'An unknown error occurred in the AI function.');
        }
        throw new Error(error.message || 'Failed to get AI response from the server.');
      }

      console.log('AI chat response data:', data);

      if (!data || !data.response) {
        console.error('Invalid data structure from AI chat function', data);
        throw new Error('The AI returned an invalid or empty response. The function may be misconfigured.');
      }

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
      
      let errorMessageContent = "I apologize, but I'm having trouble connecting to the cosmic energies right now. Please try again in a moment.";
      let errorDescription = "Unable to reach SOS Oracle. Please try again.";

      if (error instanceof Error) {
        errorMessageContent = error.message;
        errorDescription = error.message;

        if (error.message.includes('Failed to fetch') || error.message.includes('500')) {
          errorMessageContent = "It seems there is a configuration issue with the AI Oracle backend. Please ensure the Supabase function has the correct environment variables (like OPENAI_API_KEY) set up.";
          errorDescription = "Backend configuration error. Check Supabase function environment variables.";
        } else if (error.message.includes('misconfigured')) {
          errorMessageContent = error.message;
          errorDescription = "The AI Oracle function is misconfigured. Please check the server logs.";

        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: errorMessageContent,
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Oracle Connection Error",
        description: errorDescription,
        variant: "destructive",
        duration: 10000, // Show for longer
        action: (
          <ToastAction
            altText="Copy error message"
            onClick={() => navigator.clipboard.writeText(errorMessageContent)}
          >
            <Copy className="h-4 w-4" />
          </ToastAction>
        ),
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Load conversation history when component mounts or selected chart changes
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!user) return; // Don't load history if not authenticated
      
      try {
        // Reset messages to welcome message when loading
        setMessages([{
          id: '1',
          content: "Welcome to SOS Oracle! I'm your advanced AI astrologer and cosmic guide. I have deep knowledge of both Western and Vedic astrology. Ask me about your birth chart, planetary transits, relationships, career, or any spiritual guidance you seek.",
          sender: 'ai',
          timestamp: new Date()
        }]);
        
        // Clear previous conversation ID
        setConversationId(null);

        let conversations = null;

        // If a specific chart is selected, look for conversations related to that chart
        if (selectedChart?.id) {
          const { data } = await supabase
            .from('chat_conversations')
            .select('id, conversation_title, context_data')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .contains('context_data', { chart_id: selectedChart.id })
            .order('updated_at', { ascending: false })
            .limit(1);
          
          conversations = data;
        } else {
          // For general conversations, look for ones without chart_id
          const { data } = await supabase
            .from('chat_conversations')
            .select('id, conversation_title, context_data')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('updated_at', { ascending: false });
          
          // Filter in JavaScript for general conversations (no chart_id or empty context)
          conversations = data?.filter(conv => {
            const contextData = conv.context_data;
            if (!contextData || typeof contextData !== 'object' || Array.isArray(contextData)) {
              return true; // Include conversations with no context or invalid context
            }
            const chartId = (contextData as Record<string, any>).chart_id;
            return !chartId;
          }).slice(0, 1);
        }

        if (conversations && conversations[0]) {
          const conversationId = conversations[0].id;
          setConversationId(conversationId);

          // Load recent messages for this conversation
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
  }, [user, selectedChart?.id]); // Re-load when user or selected chart changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleDemo = () => {
    setShowDemo(!showDemo);
    if (!showDemo) {
      setMessages(demoMessages);
    } else {
      // Reset to welcome message
      setMessages([{
        id: '1',
        content: "Welcome to SOS Oracle! I'm your advanced AI astrologer and cosmic guide. I have deep knowledge of both Western and Vedic astrology. Ask me about your birth chart, planetary transits, relationships, career, or any spiritual guidance you seek.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
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
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Link to="/">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>


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
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => setSelectedSystem(value)} defaultValue="western">
              <SelectTrigger className="w-[180px] bg-background/70">
                <SelectValue placeholder="Select Astrological System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="western">Western</SelectItem>
                <SelectItem value="vedic">Vedic</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => {
              if (value === 'general') {
                setSelectedChart(null);
                toast({
                  title: "Switched to General Consultation",
                  description: "Chat cleared. Starting fresh general conversation.",
                });
              } else {
                const chart = savedCharts.find(c => c.id === parseInt(value));
                if (chart) {
                  setSelectedChart(chart);
                  toast({
                    title: "Chart Selected",
                    description: `Switched to ${chart.name}'s consultation. Loading chat history...`,
                  });
                }
              }
            }}>
              <SelectTrigger className="w-[220px] bg-background/70">
                <SelectValue placeholder="Select a chart for consultation..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span>General Inquiry</span>
                  </div>
                </SelectItem>
                {savedCharts.map(chart => (
                  <SelectItem key={chart.id} value={chart.id!.toString()}>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>{chart.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2" />
              Online
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full">
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
                          disabled={!user}
                        >
                          <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                        </Button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder={user ? "Ask SOS Oracle about your chart, relationships, career, or spiritual guidance..." : "Sign in to start chatting with SOS Oracle"}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && user && !isTyping && handleSendMessage()}
                            disabled={!user || isTyping}
                            className="bg-input/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 pr-12 disabled:opacity-50"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!user || !inputMessage.trim() || isTyping}
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
                      </div>          <p className="text-xs text-muted-foreground mt-2 text-center">
            Ask about astrological insights, birth chart analysis, or cosmic guidance
          </p>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.isError ? 'bg-destructive/20' : 'bg-accent/10'}`}>
                    <Bot className={`w-4 h-4 ${message.isError ? 'text-destructive' : 'text-accent'}`} />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary/10 text-primary-foreground ml-auto'
                      : message.isError ? 'bg-destructive/10 text-destructive-foreground' : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.isError && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive-foreground/70 hover:text-destructive-foreground"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
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
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">SOS Oracle is consulting the cosmos...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Attached ref here */}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>


    </div>
  );
};

export default SOSOracle;