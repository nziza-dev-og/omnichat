import ChatInterface from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl h-full py-4 flex flex-col">
      <ChatInterface />
    </div>
  );
}
