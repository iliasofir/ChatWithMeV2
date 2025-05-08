import { motion } from "framer-motion";

const MessageItem = ({ message, isSender, isLatestMessage }) => {
  // Secure timestamp conversion
  const getTimestamp = () => {
    try {
      if (message.timestamp?.toDate) {
        return message.timestamp.toDate();
      } else if (message.timestamp?.seconds) {
        return new Date(message.timestamp.seconds * 1000);
      } else if (message.timestamp) {
        return new Date(message.timestamp);
      }
      return new Date();
    } catch (error) {
      console.error("Error parsing timestamp:", error);
      return new Date();
    }
  };

  const formattedTime = getTimestamp().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = getTimestamp().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, delay: isLatestMessage ? 0.1 : 0 }}
      className={`w-full flex my-2 ${isSender ? "justify-end" : "justify-start"}`}
      role="article"
      aria-label={isSender ? "Sent message" : "Received message"}
    >
      <div className={`flex items-end gap-3 max-w-[70%] ${isSender ? "flex-row-reverse" : ""}`}>
      {/* Avatar (only for receiver) */}
        {!isSender && (
          <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-600 text-white shadow-md ring-2 ring-cyan-300/50 animate-pulse"            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {message.senderName?.charAt(0).toUpperCase() || "?"}
            </motion.div>
        )}

         {/* Message content */}
         <div className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
          {!isSender && (
            <span className="text-xs text-gray-400 mb-1">
              {message.senderName || "Unknown"}
            </span>
          )}
          <div
            className={`px-4 py-2 rounded-2xl shadow-lg ${
              isSender 
                ? "bg-indigo-600 text-white rounded-br-none" 
                : "bg-white text-gray-900 rounded-bl-none"
            } backdrop-blur-md bg-opacity-90`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
            <div className={`text-xs mt-1 ${isSender ? "text-indigo-100" : "text-gray-500"}`}>
              {formattedTime}
            </div>
          </div>
        </div>
      </div>


      {/* Sticky date separator */}
      {isLatestMessage && (
        <div className="sticky top-0 z-10 text-center my-4">
          <span className="inline-block bg-gray-800/80 text-gray-200 text-xs font-medium px-4 py-1 rounded-full shadow">
            {formattedDate}
          </span>
        </div>
      )}

    </motion.div>
  );
};

export default MessageItem;