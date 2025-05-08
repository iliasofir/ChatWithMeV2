import { useState } from 'react';
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

function ImageUpload({ userId }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', userId), { profilePicture: url });
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Upload Profile Picture
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default ImageUpload;