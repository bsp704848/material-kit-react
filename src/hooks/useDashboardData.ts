// src/hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../server/lib/firebase';

export const useDashboardData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [numProducts, setNumProducts] = useState<number>(0);
  const [numUsers, setNumUsers] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const usersSnapshot = await getDocs(collection(db, 'users'));

        setNumProducts(productsSnapshot.size);
        setNumUsers(usersSnapshot.size);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, numProducts, numUsers };
};
