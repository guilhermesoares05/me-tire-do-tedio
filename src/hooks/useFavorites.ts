import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { FavoriteMovie } from '@/types';

export const useFavorites = (userId: string | undefined) => {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, `users/${userId}/favorites`), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FavoriteMovie));
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [userId]);

  const addFavorite = async (movie: Omit<FavoriteMovie, 'id' | 'createdAt'>) => {
    if (!userId) throw new Error("User not authenticated");
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/favorites`), {
        ...movie,
        createdAt: serverTimestamp()
      });

      // Optimistic update
      const newMovie: FavoriteMovie = {
        id: docRef.id,
        ...movie,
        createdAt: Timestamp.now()
      };

      setFavorites(prev => [newMovie, ...prev]);
      return docRef.id;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  };

  return { favorites, loading, addFavorite };
};
