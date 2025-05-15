import ChatInterface from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl flex-grow flex flex-col py-0 md:py-4">
      <ChatInterface />
    </div>
  );
}
