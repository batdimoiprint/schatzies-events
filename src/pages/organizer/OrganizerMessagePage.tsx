import { useRef, useState } from 'react';
import type * as React from 'react';
import { Search, MoreVertical, Paperclip, Send, X } from 'lucide-react';

// DUMMY DATA FOR API PREPARATION - Added Contact Details
const dummyChats = [
  {
    id: 1,
    name: 'Christian Dace Juliales',
    initial: 'C',
    color: 'bg-[#db4b88]',
    lastMsg: 'I will send the details later today.',
    time: '11:11 AM',
    unread: 2,
    online: true,
    email: 'christian.juliales@example.com',
    phone: '+63 912 345 6789',
    location: 'Quezon City, Philippines',
    role: 'Client',
    statusText: 'Excited for the upcoming event preparations!',
  },
  {
    id: 2,
    name: 'Diane M. Rotono',
    initial: 'D',
    color: 'bg-[#4bc783]',
    lastMsg: 'Oh yes! I have seen that earlier. But I have some...',
    time: '11:11 AM',
    unread: 0,
    online: false,
    email: 'diane.rotono@example.com',
    phone: '+63 998 765 4321',
    location: 'Makati City, Philippines',
    role: 'Client',
    statusText: 'Reviewing the new event packages.',
  },
  {
    id: 3,
    name: 'Sabrina Carpenter',
    initial: 'S',
    color: 'bg-[#5b54e3]',
    lastMsg: 'Thank you for the updates.',
    time: '11:11 AM',
    unread: 0,
    online: true,
    email: 'sabrina.carpenter@example.com',
    phone: '+63 945 123 9876',
    location: 'Bonifacio Global City, PH',
    role: 'Vendor',
    statusText: 'Available for bookings this December.',
  },
];

const initialConversations: Record<number, any[]> = {
  1: [
    {
      id: 1,
      senderId: 1,
      text: 'Hi! Are you available for a meeting? I would like to discuss the new event package.',
      time: '10:30 AM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Hello! Yes, I am available this afternoon. What time works best for you?',
      time: '10:45 AM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 1,
      text: 'I will send the details later today.',
      time: '11:11 AM',
      isMe: false,
    },
  ],
  2: [
    {
      id: 4,
      senderId: 2,
      text: 'Oh yes! I have seen that earlier. But I have some revisions.',
      time: '9:00 AM',
      isMe: false,
    },
  ],
  3: [
    { id: 5, senderId: 3, text: 'Thank you for the updates.', time: '8:30 AM', isMe: false },
    {
      id: 6,
      senderId: 'me',
      text: 'You are welcome! Let me know if you need anything else.',
      time: '8:45 AM',
      isMe: true,
    },
  ],
};

export function OrganizerMessagePage() {
  const [activeChatId, setActiveChatId] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = dummyChats.find((c) => c.id === activeChatId) || dummyChats[0];
  const currentMessages = conversations[activeChatId] || [];
  const filteredChats = dummyChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // API-ready handler: replace local update with API call when backend is connected.
  const handleSendMessage = () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage && !selectedFile) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'me',
      text: trimmedMessage || (selectedFile ? `Sent a file: ${selectedFile.name}` : ''),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setConversations((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));
    setMessageText('');
    setSelectedFile(null); // Reset file after sending
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // You can immediately trigger send here or wait for text
    }
  };

  return (
    //part ng size ng whole page.
    <div className="flex h-[calc(100vh-150px)] w-full gap-6 bg-transparent pb-4">
      {/* ---------------- LEFT SIDEBAR (INBOX LIST) ---------------- */}
      <div className="flex w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm">
        <div className="border-b border-[#f0edf4] p-4">
          <h2 className="mb-4 text-lg font-bold text-[#2d2834]">Message Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#ddd8e8] bg-[#f6f5f8] py-2.5 pl-10 pr-4 text-sm text-[#4f4a56] outline-none focus:border-[#df2b80]"
            />
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex cursor-pointer items-center gap-3 border-b border-[#f0edf4] p-4 transition-colors ${
                  activeChatId === chat.id
                    ? 'border-l-4 border-l-[#df2b80] bg-[#fafafa]'
                    : 'border-l-4 border-l-transparent hover:bg-[#fafafa]'
                }`}
              >
                <div
                  className={`relative flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${chat.color}`}
                >
                  {chat.initial}
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#4bc783]"></span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="truncate text-sm font-bold text-[#2d2834]">{chat.name}</h4>
                    <span className="ml-2 whitespace-nowrap text-[10px] font-semibold text-[#a49cb3]">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-medium text-[#696373]">{chat.lastMsg}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 flex size-4 items-center justify-center rounded-full bg-[#df2b80] text-[9px] font-bold text-white">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm font-medium text-[#a49cb3]">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* ---------------- MIDDLE SIDE (CHAT AREA) ---------------- */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm transition-all duration-300">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-[#f0edf4] px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`relative flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-white ${activeChat.color}`}
            >
              {activeChat.initial}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2d2834]">{activeChat.name}</h3>
              <p className="text-xs font-semibold text-[#4bc783]">
                {activeChat.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#8f879f]">
            {/* TOGGLE DETAILS BUTTON */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`transition-colors ${showDetails ? 'text-[#df2b80]' : 'hover:text-[#df2b80]'}`}
            >
              <MoreVertical className="size-5" />
            </button>
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa] p-6">
          <div className="flex flex-col gap-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex max-w-[70%] flex-col gap-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      msg.isMe
                        ? 'rounded-br-none bg-gradient-to-r from-[#df2b80] to-[#8f1fd1] text-white'
                        : 'rounded-bl-none border border-[#e2deea] bg-white text-[#4f4a56] shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span
                    className={`text-[10px] font-semibold text-[#a49cb3] ${
                      msg.isMe ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t border-[#f0edf4] bg-white p-4">
          {/* File Preview (Optional, shows if a file is selected) */}
          {selectedFile && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-[#f6f5f8] px-4 py-2 text-sm text-[#4f4a56]">
              <span className="truncate pr-4 font-medium">{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-[#df2b80] hover:text-[#c92472]"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            {/* Purple Attachment Button */}
            <button
              onClick={handleAttachmentClick}
              className="flex size-[42px] shrink-0 items-center justify-center rounded-[14px] bg-[#8f1fd1] text-white transition-colors hover:bg-[#7a18b3]"
            >
              <Paperclip className="size-5" />
            </button>

            {/* Gray Pill Input Wrapper */}
            <div className="flex flex-1 items-center rounded-full bg-[#f3f1f5] px-5 py-2.5">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write something......"
                className="flex-1 bg-transparent text-sm text-[#2d2834] outline-none placeholder:text-[#a49cb3]"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 flex items-center justify-center text-[#8f1fd1] transition-colors hover:text-[#7a18b3]"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT SIDE (CONTACT DETAILS) ---------------- */}
      {showDetails && (
        <div className="animate-in slide-in-from-right-4 fade-in flex w-[320px] shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm duration-300">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f0edf4] bg-white px-6 py-4">
            <h3 className="text-base font-bold text-[#2d2834]">Contact Details</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-[#8f879f] transition-colors hover:text-[#df2b80]"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Profile Picture & Name */}
          <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
            <div
              className={`mb-4 flex size-24 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md ${activeChat.color}`}
            >
              {activeChat.initial}
            </div>
            <h4 className="text-lg font-bold leading-tight text-[#2d2834]">{activeChat.name}</h4>
            <span className="mt-2 rounded-full bg-[#f8f5fe] px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#8f1fd1]">
              {activeChat.role}
            </span>
            <p className="mt-4 text-sm font-medium italic text-[#696373]">
              "{activeChat.statusText}"
            </p>
          </div>

          {/* Information List */}
          <div className="flex flex-col gap-5 border-t border-[#f0edf4] p-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a49cb3]">
                Email Address
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-[#2d2834]">
                {activeChat.email}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a49cb3]">
                Phone Number
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2d2834]">{activeChat.phone}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a49cb3]">
                Location
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2d2834]">{activeChat.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
