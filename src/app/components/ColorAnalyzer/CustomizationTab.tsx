'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { storage, db } from '@/lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import ImageUpload from '@/components/ImageUpload';
import { Season } from '@/lib/types/color';
import { User } from 'firebase/auth';

interface CustomizationTabProps {
  season: Season;
}

interface CustomNote {
  id: string;
  text: string;
  createdAt: number;
}

interface CustomImage {
  id: string;
  url: string;
  caption: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export default function CustomizationTab({ season }: CustomizationTabProps) {
  const { user } = useAuth() as AuthContextType;
  const [notes, setNotes] = useState<CustomNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [images, setImages] = useState<CustomImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      // Load notes from Firestore
      const docRef = doc(db, 'userCustomizations', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNotes(docSnap.data().notes || []);
      }

      // Load images from Storage
      const imagesRef = ref(storage, `users/${user.uid}/custom-images`);
      const imagesList = await listAll(imagesRef);
      const imagesData = await Promise.all(
        imagesList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            id: item.name,
            url,
            caption: '',
            createdAt: Date.now()
          };
        })
      );
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return;

    const noteData: CustomNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: Date.now()
    };

    try {
      const updatedNotes = [...notes, noteData];
      await setDoc(doc(db, 'userCustomizations', user.uid), {
        notes: updatedNotes
      }, { merge: true });
      
      setNotes(updatedNotes);
      setNewNote('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file || !user) return;

    try {
      const imageRef = ref(storage, `users/${user.uid}/custom-images/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      const newImage: CustomImage = {
        id: imageRef.name,
        url,
        caption: '',
        createdAt: Date.now()
      };

      setImages([...images, newImage]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Notes Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Stylist Notes</h3>
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about your color analysis..."
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 resize-none"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            Add Note
          </button>
        </div>
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-gray-200">{note.text}</p>
              <span className="text-sm text-gray-400">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Style Gallery</h3>
        <ImageUpload onImageChange={handleImageUpload} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt="Custom style"
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 