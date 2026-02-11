import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Verdict } from '@/types';

export const useHistory = (userId: string | undefined) => {
  const [history, setHistory] = useState<Verdict[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, `users/${userId}/history`), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Verdict));
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  const addHistoryItem = async (verdict: Verdict) => {
    if (!userId) return;
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/history`), {
        ...verdict,
        createdAt: Timestamp.now()
      });

      const newVerdict = { ...verdict, id: docRef.id, createdAt: Timestamp.now() };
      setHistory(prev => [newVerdict, ...prev]);
    } catch (error) {
      console.error("Error adding history item:", error);
      throw error;
    }
  };

  return { history, loading, addHistoryItem };
};
