import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, onSnapshot, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import ImageUpload from './ImageUpload';

function ProfilePage() {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) return; // Wait until currentUser is available

    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      setUserData(doc.data());
    }, (error) => {
      console.error('ProfilePage onSnapshot error:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess('');
  
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', contactEmail));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        setContactError('User not found.');
        return;
      }
  
      const contactDoc = querySnapshot.docs[0];
      const contactId = contactDoc.id;
      const contactData = contactDoc.data(); // <-- La variable s'appelle contactData
  
      if (contactId === currentUser.uid) {
        setContactError('You cannot add yourself as a contact.');
        return;
      }
  
      // Correction ici : remplacer 'contact' par 'contactData'
      await setDoc(doc(db, `users/${currentUser.uid}/contacts`, contactId), {
        displayName: contactData.displayName, // <-- Utiliser contactData au lieu de contact
        status: 'pending',
        initiator: true
      });
  
      await setDoc(doc(db, `users/${contactId}/contacts`, currentUser.uid), {
        displayName: currentUser.displayName,
        status: 'pending',
        initiator: false
      });
  
      setContactSuccess(`Invitation sent to ${contactData.displayName}!`);
      setContactEmail('');
    } catch (err) {
      console.error('Error adding contact:', err);
      setContactError(`Failed to add contact: ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {userData && (
        <div className="space-y-4">
          <p><strong>Name:</strong> {userData.displayName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          {userData.profilePicture && (
            <img src={userData.profilePicture} alt="Profile" className="w-32 h-32 rounded-full" />
          )}
          <ImageUpload userId={currentUser.uid} />
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Add a Contact</h3>
        <form onSubmit={handleAddContact} className="space-y-4">
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Enter contact's email"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Add Contact
          </button>
        </form>
        {contactError && <p className="text-red-500 mt-2">{contactError}</p>}
        {contactSuccess && <p className="text-green-500 mt-2">{contactSuccess}</p>}
      </div>
    </div>
  );
}

export default ProfilePage;