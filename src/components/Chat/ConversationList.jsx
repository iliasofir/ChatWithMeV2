import { useState, useEffect, useContext } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

function ConversationList({ onSelectChat }) {
  const [contacts, setContacts] = useState([]);
  const [pendingContacts, setPendingContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Charger les contacts acceptés
    const acceptedContactsQuery = query(
      collection(db, `users/${currentUser.uid}/contacts`),
      where("status", "==", "accepted")
    );

    // Charger les invitations en attente (où l'utilisateur est le destinataire)
    const pendingContactsQuery = query(
      collection(db, `users/${currentUser.uid}/contacts`),
      where("status", "==", "pending"),
      where("initiator", "==", false)
    );

    const unsubscribeAccepted = onSnapshot(
      acceptedContactsQuery,
      (snapshot) => {
        const contactList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(contactList);
      },
      (error) => {
        console.error("Error loading contacts:", error);
        setError("Failed to load contacts");
      }
    );

    const unsubscribePending = onSnapshot(
      pendingContactsQuery,
      (snapshot) => {
        const pendingList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingContacts(pendingList);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading pending contacts:", error);
        setError("Failed to load pending contacts");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAccepted();
      unsubscribePending();
    };
  }, [currentUser]);

  const handleAcceptContact = async (contactId) => {
    try {
      // Mettre à jour le statut pour l'utilisateur actuel
      await updateDoc(doc(db, `users/${currentUser.uid}/contacts`, contactId), {
        status: "accepted"
      });

      // Mettre à jour le statut pour le contact
      await updateDoc(doc(db, `users/${contactId}/contacts`, currentUser.uid), {
        status: "accepted"
      });
    } catch (err) {
      console.error("Error accepting contact:", err);
      setError("Failed to accept contact");
    }
  };

  const handleRejectContact = async (contactId) => {
    try {
      // Supprimer le contact pour l'utilisateur actuel
      await updateDoc(doc(db, `users/${currentUser.uid}/contacts`, contactId), {
        status: "rejected"
      });

      // Mettre à jour le statut pour le contact
      await updateDoc(doc(db, `users/${contactId}/contacts`, currentUser.uid), {
        status: "rejected"
      });
    } catch (err) {
      console.error("Error rejecting contact:", err);
      setError("Failed to reject contact");
    }
  };

  return (
    <div className="w-1/4 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Conversations</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <>
          {/* Section des invitations en attente */}
          {pendingContacts.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Pending Invitations</h4>
              <ul className="space-y-2">
                {pendingContacts.map((contact) => (
                  <li key={contact.id} className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {contact.displayName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="text-gray-700">{contact.displayName}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptContact(contact.id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectContact(contact.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section des contacts acceptés */}
          {contacts.length === 0 ? (
            <div className="text-gray-500 text-sm">
              <p>No conversations yet. Add contacts to start chatting!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {contacts.map((contact) => {
                const chatId = [currentUser.uid, contact.id].sort().join("_");
                return (
                  <li
                    key={contact.id}
                    className="p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200 focus:bg-blue-50 focus:outline-none"
                    onClick={() =>
                      onSelectChat({
                        type: "private",
                        id: chatId,
                        name: contact.displayName,
                      })
                    }
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelectChat({
                          type: "private",
                          id: chatId,
                          name: contact.displayName,
                        });
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {contact.displayName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-800 font-medium">
                          {contact.displayName}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default ConversationList;