import { useState, useContext } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";

function ChatWindow() {
  const { currentUser } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedChat || !currentUser) return;
  
    const path = `chats/${selectedChat.id}/messages`;
    await addDoc(collection(db, path), {
      text: input,
      sender: currentUser.uid, // Changed from senderId to sender
      senderName: currentUser.displayName,
      timestamp: new Date(),
    });
    setInput("");
  };

  return (
    <div className="flex h-screen pt-16">
      <ConversationList onSelectChat={setSelectedChat} />
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedChat.name}</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessageList selectedChat={selectedChat} currentUserId={currentUser?.uid} />
            </div>
            <form onSubmit={sendMessage} className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
