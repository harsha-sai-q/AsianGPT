import { ChatShell } from '@/components/chat/chat-shell';
import { getConversationsAction } from '@/app/actions/chat';

export const runtime = 'edge';

export default async function ChatPage() {
  const conversations = await getConversationsAction();
  return (
    <main className="p-4">
      <ChatShell initialConversations={conversations} />
    </main>
  );
}
