import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadDailyChallengePhoto(userId: string, file: File): Promise<string> {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  const path = `users/${userId}/daily-challenges/${dateString}.jpg`;
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
} 