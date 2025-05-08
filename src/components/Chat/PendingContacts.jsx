function PendingContacts() {
    const [pendingContacts, setPendingContacts] = useState([]);
    const { currentUser } = useContext(AuthContext);
  
    useEffect(() => {
      const q = query(
        collection(db, `users/${currentUser.uid}/contacts`),
        where("status", "==", "pending"),
        where("initiator", "==", false)
      );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPendingContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
  
      return unsubscribe;
    }, [currentUser]);
  
    const handleResponse = async (contactId, response) => {
      // Mettre à jour les deux côtés
      await setDoc(doc(db, `users/${currentUser.uid}/contacts`, contactId), {
        status: response ? 'accepted' : 'rejected'
      }, { merge: true });
  
      await setDoc(doc(db, `users/${contactId}/contacts`, currentUser.uid), {
        status: response ? 'accepted' : 'rejected'
      }, { merge: true });
    };
  
    return (
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Invitations en attente</h4>
        {pendingContacts.map(contact => (
          <ContactRequest
            key={contact.id}
            contact={contact}
            onAccept={() => handleResponse(contact.id, true)}
            onReject={() => handleResponse(contact.id, false)}
          />
        ))}
      </div>
    );
  }