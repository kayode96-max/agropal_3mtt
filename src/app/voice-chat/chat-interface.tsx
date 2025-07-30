
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Mic, Bot, User, Send } from "lucide-react";
import { voiceChatAIResponse } from "@/ai/flows/voice-chat-ai-response";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [textQuery, setTextQuery] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const setupSpeechRecognition = () => {
      if (typeof window !== "undefined") {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = "en-US";

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleUserQuery(transcript);
          };

          recognition.onerror = (event) => {
            let errorMessage = `An unknown voice error occurred: ${event.error}.`;

            if (event.error === 'network') {
              errorMessage = "Voice recognition failed. This can sometimes happen if the service is busy. Please try speaking again in a clear voice."
            } else if (event.error === 'not-allowed') {
              errorMessage = "Microphone access was denied. Please enable it in your browser settings."
            } else if (event.error === 'no-speech') {
                errorMessage = "No speech was detected. Please try again.";
            } else {
              console.error("Speech recognition error", event.error);
            }

            toast({ title: "Voice Error", description: errorMessage, variant: "destructive" });
            setIsRecording(false);
          };
          
          recognition.onend = () => {
              setIsRecording(false);
          };

          recognitionRef.current = recognition;
        } else {
          toast({ title: "Browser Not Supported", description: "Voice recognition is not supported in your browser.", variant: "destructive" });
        }
      }
    };
    
    const requestMicPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setMicReady(true);
            setupSpeechRecognition(); // Setup recognition only after getting permission
        } catch (err) {
            console.error("Microphone permission denied", err);
            toast({ title: "Mic Permission Denied", description: "Please allow microphone access in your browser settings to use voice chat.", variant: "destructive" });
            setMicReady(false);
        }
    }
    requestMicPermission();

    // Greet the user on component mount
    const greeting = "Welcome to Agropal! My name is Agbè̩ anko. How can I help you today?";
    setMessages([{ sender: "ai", text: greeting }]);
    speak(greeting);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);


  const handleUserQuery = async (query: string) => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setIsLoading(true);

    try {
      const result = await voiceChatAIResponse({ query });
      const aiResponse = result.response;
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      speak(aiResponse);
    } catch (error) {
      console.error("AI response error", error);
       toast({ title: "AI Error", description: "Failed to get a response from the assistant.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserQuery(textQuery);
    setTextQuery("");
  }

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        if (text.match(/[\u0100-\u017F\u0180-\u024F]/)) {
             utterance.lang = "yo-NG";
        } else {
             utterance.lang = "en-NG";
        }
        window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!micReady) {
        toast({ title: "Microphone Not Ready", description: "Please allow microphone access to start recording.", variant: "destructive" });
        return;
    }
    if (!recognitionRef.current) {
         toast({ title: "Voice Not Ready", description: "Voice recognition is not set up yet.", variant: "destructive" });
         return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if(messages.length > 0 && messages[messages.length-1].sender === 'ai'){
          window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch(e) {
          console.error("Could not start recognition", e)
          toast({ title: "Voice Error", description: "Could not start voice recognition.", variant: "destructive" });
      }
    }
  };
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const viewport = scrollArea.querySelector('div');
      if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages])


  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full">
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-[45vh] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.sender === "user" ? "justify-end" : "justify-start")}>
                  {message.sender === "ai" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("rounded-lg px-4 py-2 max-w-sm shadow-md", message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p>{message.text}</p>
                  </div>
                   {message.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
         <div className="p-4 border-t bg-background">
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                 <Button
                    type="button"
                    onClick={toggleRecording}
                    disabled={isLoading || !micReady}
                    className={cn(
                        "w-12 h-10 rounded-lg text-white shadow-md transition-all duration-300 transform-gpu focus:outline-none focus:ring-4 focus:ring-primary/50",
                        isRecording ? "bg-red-600 scale-105 animate-pulse" : "bg-primary hover:bg-primary/90",
                        isLoading || !micReady ? "bg-gray-400" : ""
                    )}
                    aria-label={isRecording ? "Stop Recording" : "Start Recording"}
                    >
                    <Mic className="h-5 w-5" />
                </Button>
                <Input 
                    placeholder="Type your question here..."
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !textQuery.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
      </Card>
    </div>
  );
}
