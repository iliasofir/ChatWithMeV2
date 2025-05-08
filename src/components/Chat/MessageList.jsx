import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  endBefore,
  getDocs,
} from "firebase/firestore";
import MessageItem from "./MessageItem";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ArrowPathIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { useInView } from "react-intersection-observer";

const MESSAGES_PER_BATCH = 25;

function MessageList({ selectedChat, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { ref: topObserverRef, inView: isTopInView } = useInView({ threshold: 0.1 });

  // Deduplicate messages
  const deduplicateMessages = (messages) => {
    const seen = new Set();
    return messages.filter(message => {
      const duplicate = seen.has(message.id);
      seen.add(message.id);
      return !duplicate;
    });
  };

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollButton(scrollHeight - scrollTop > clientHeight + 50);
  }, []);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Load initial messages
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      setLoading(false);
      setHasMoreMessages(false);
      return;
    }

    setLoading(true);
    const path = `chats/${selectedChat.id}/messages`;
    const messagesQuery = query(
      collection(db, path),
      orderBy("timestamp", "desc"),
      limit(MESSAGES_PER_BATCH)
    );

    const unsubscribe = onSnapshot(messagesQuery, 
      (snapshot) => {
        const messageList = snapshot.docs.map(doc => ({
          id: doc.id,
          senderId: doc.data().sender,
          senderName: doc.data().senderName || "Unknown",
          text: doc.data().text || "",
          timestamp: doc.data().timestamp?.toDate() || new Date(doc.data().timestamp?.seconds * 1000)
        })).filter(msg => msg.timestamp);

        const orderedMessages = deduplicateMessages(messageList.reverse());
        
        if (orderedMessages.length > 0) {
          setLastTimestamp(orderedMessages[orderedMessages.length - 1].timestamp);
        }

        setMessages(orderedMessages);
        setHasMoreMessages(snapshot.docs.length >= MESSAGES_PER_BATCH);
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      },
      (err) => {
        console.error("Error loading messages:", err);
        setError("Failed to load messages");
        setLoading(false);
      }
    );

    const typingTimer = setInterval(() => {
      if (Math.random() > 0.8) setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(typingTimer);
    };
  }, [selectedChat, scrollToBottom]);

  // Load older messages
  useEffect(() => {
    if (!isTopInView || !hasMoreMessages || loadingMore || !lastTimestamp) return;

    const loadMoreMessages = async () => {
      setLoadingMore(true);
      try {
        const path = `chats/${selectedChat.id}/messages`;
        const olderMessagesQuery = query(
          collection(db, path),
          orderBy("timestamp", "desc"),
          endBefore(lastTimestamp),
          limit(MESSAGES_PER_BATCH)
        );

        const snapshot = await getDocs(olderMessagesQuery);
        if (snapshot.empty) return setHasMoreMessages(false);

        const olderMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          senderId: doc.data().sender,
          senderName: doc.data().senderName || "Unknown",
          text: doc.data().text || "",
          timestamp: doc.data().timestamp?.toDate() || new Date(doc.data().timestamp?.seconds * 1000)
        })).filter(msg => msg.timestamp);

        const combined = deduplicateMessages([...olderMessages.reverse(), ...messages]);
        setMessages(combined);
        setLastTimestamp(olderMessages[0]?.timestamp);
        setHasMoreMessages(snapshot.docs.length >= MESSAGES_PER_BATCH);
      } catch (err) {
        console.error("Error loading older messages:", err);
        setError("Failed to load older messages");
      } finally {
        setLoadingMore(false);
      }
    };

    loadMoreMessages();
  }, [isTopInView, hasMoreMessages, loadingMore, lastTimestamp, selectedChat, messages]);

  // Group messages by date
  const groupedMessages = messages.sort((a, b) => a.timestamp - b.timestamp)
    .reduce((groups, message) => {
      const date = message.timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    }, {});

  // Scroll handlers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (messages.length === 0 || loading || loadingMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollHeight - (scrollTop + clientHeight) < 200) {
      scrollToBottom("auto");
    }
  }, [messages.length, loading, loadingMore, scrollToBottom]);

  // Typing indicator
  const renderTypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center space-x-2 pl-4 py-2"
    >
      <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 bg-blue-400 rounded-full mx-0.5"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">Someone is typing...</span>
    </motion.div>
  );

  return (
    <div className="relative flex-1 bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Chat header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-md z-20 border-b border-gray-800 px-4 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            {selectedChat?.name?.[0] || "?"}
          </div>
          <div>
            <h3 className="font-medium text-white">{selectedChat?.name || "Chat"}</h3>
            <div className="flex items-center text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="pt-16 h-full">
        <div
          ref={scrollContainerRef}
          className="relative h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent px-4 py-6"
        >
          {loading && !messages.length ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-10 w-10 rounded-full border-2 border-t-indigo-500 border-r-indigo-500 border-b-indigo-300/30 border-l-indigo-300/30"
                />
                <p className="mt-4 text-sm text-gray-400">Loading messages...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl p-6 max-w-md text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                  {/* Error icon */}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Error</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 max-w-md text-center">
                {/* No messages state */}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {loadingMore && (
                <div ref={topObserverRef} className="flex justify-center py-3">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/70 rounded-full text-xs text-gray-300">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-3 w-3 border-t border-r border-indigo-400 border-b-transparent border-l-transparent rounded-full"
                    />
                    <span>Loading older messages</span>
                  </div>
                </div>
              )}

              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="message-group">
                  <div className="sticky top-0 z-10 flex justify-center my-4">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3 py-1.5 bg-gray-800/90 backdrop-blur-md text-gray-300 text-xs font-medium rounded-full shadow-lg border border-gray-700/50 flex items-center"
                    >
                      <ClockIcon className="w-3 h-3 mr-1.5" />
                      {date}
                    </motion.div>
                  </div>

                  <div className="space-y-2 px-4">
                    {dateMessages.map((message) => (
                      <MessageItem
                        key={message.id}
                        message={message}
                        isSender={message.senderId === currentUserId}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <AnimatePresence>
                {isTyping && renderTypingIndicator()}
              </AnimatePresence>

              <div ref={messagesEndRef} className="h-px" />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg z-20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDownIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MessageList;