import { Mic } from "lucide-react";
import { ChatInterface } from "./chat-interface";

export default function VoiceChatPage() {
    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-10 px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col items-center text-center mb-10">
                <Mic className="h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl font-bold tracking-tight font-headline">Kaabo, Welcome!</h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                    Ask questions in English, Yoruba, Hausa, Igbo or Pidgin. Press the button and start speaking.
                </p>
            </div>
            <div className="flex-grow flex flex-col justify-end">
                 <ChatInterface />
            </div>
        </div>
    )
}
