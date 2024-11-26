import { db, storage } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  getStorage, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Season, SeasonalProfile, ColorInfo, InspirationImage } from '../types/color';

interface ColorAnalysis {
  userId: string;
  season: Season;
  favorites: string[];
  profile: SeasonalProfile;
  dateAnalyzed: Date;
  customCombinations?: {
    name: string;
    colors: string[];
    occasion: string;
    notes?: string;
  }[];
  personalNotes?: {
    id: string;
    text: string;
    createdAt: Date;
    createdBy: string;
  }[];
  inspirationImages?: {
    id: string;
    url: string;
    caption: string;
    createdAt: Date;
  }[];
}

export type { ColorAnalysis };

export async function saveColorAnalysis(
  userId: string, 
  analysisData: Omit<ColorAnalysis, 'userId' | 'dateAnalyzed'> | null
) {
  try {
    const analysisRef = doc(db, 'colorAnalysis', userId);
    if (analysisData === null) {
      // Delete the document if analysisData is null
      await setDoc(analysisRef, {
        userId,
        deleted: true,
        updatedAt: Timestamp.now()
      });
    } else {
      await setDoc(analysisRef, {
        ...analysisData,
        userId,
        dateAnalyzed: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    return true;
  } catch (error) {
    console.error('Error saving color analysis:', error);
    throw error;
  }
}

export async function getUserAnalysis(userId: string) {
  try {
    const analysisRef = doc(db, 'colorAnalysis', userId);
    const analysisDoc = await getDoc(analysisRef);
    if (analysisDoc.exists()) {
      const data = analysisDoc.data();
      return {
        id: analysisDoc.id,
        userId: data.userId,
        season: data.season,
        favorites: data.favorites,
        profile: data.profile,
        dateAnalyzed: data.dateAnalyzed.toDate(),
        customCombinations: data.customCombinations,
        personalNotes: data.personalNotes,
        inspirationImages: data.inspirationImages
      } as ColorAnalysis;
    }
    return null;
  } catch (error) {
    console.error('Error getting user analysis:', error);
    throw error;
  }
}

export async function toggleFavoriteColor(userId: string, colorHex: string) {
  try {
    const analysisRef = doc(db, 'colorAnalysis', userId);
    const analysis = await getDoc(analysisRef);
    
    if (analysis.exists()) {
      const favorites = analysis.data().favorites || [];
      const isColorFavorited = favorites.includes(colorHex);
      
      await updateDoc(analysisRef, {
        favorites: isColorFavorited 
          ? arrayRemove(colorHex)
          : arrayUnion(colorHex),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error toggling favorite color:', error);
    throw error;
  }
}

export async function saveCustomCombination(
  userId: string,
  combination: {
    name: string;
    colors: string[];
    occasion: string;
    notes?: string;
  }
) {
  try {
    const analysisRef = doc(db, 'colorAnalysis', userId);
    await updateDoc(analysisRef, {
      customCombinations: arrayUnion(combination),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving custom combination:', error);
    throw error;
  }
}

export async function removeColorFromPalette(userId: string, colorHex: string) {
  try {
    const analysisRef = doc(db, 'colorAnalysis', userId);
    const analysis = await getDoc(analysisRef);
    
    if (analysis.exists()) {
      const data = analysis.data();
      const season = data.season;
      const currentColors = data.profile.colors[season] || [];
      const updatedColors = currentColors.filter(
        (color: ColorInfo) => color.hex !== colorHex
      );
      
      await updateDoc(analysisRef, {
        [`profile.colors.${season}`]: updatedColors,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error removing color from palette:', error);
    throw error;
  }
}

export async function addCustomColorToPalette(userId: string, colorInfo: ColorInfo) {
  try {
    const analysisRef = doc(db, 'colorAnalysis', userId);
    const analysis = await getDoc(analysisRef);
    
    if (analysis.exists()) {
      const data = analysis.data();
      const season = data.season;
      
      await updateDoc(analysisRef, {
        [`profile.colors.${season}`]: arrayUnion(colorInfo),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error adding custom color to palette:', error);
    throw error;
  }
}

export const savePersonalNote = async (userId: string, noteData: Omit<Note, 'id'> & { id?: string }) => {
  const finalNoteData = {
    ...noteData,
    id: noteData.id || crypto.randomUUID(),
    createdAt: noteData.createdAt || Timestamp.now()
  };

  const userRef = doc(db, 'users', userId);
  const notesRef = collection(userRef, 'notes');
  
  await setDoc(doc(notesRef, finalNoteData.id), finalNoteData);
  
  return finalNoteData;
};

export async function deletePersonalNote(userId: string, noteId: string) {
  try {
    const analysisRef = doc(db, 'colorAnalysis', userId);
    const analysis = await getDoc(analysisRef);
    
    if (analysis.exists()) {
      const data = analysis.data();
      const updatedNotes = (data.personalNotes || []).filter(
        (note: any) => note.id !== noteId
      );
      
      await updateDoc(analysisRef, {
        personalNotes: updatedNotes,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error deleting personal note:', error);
    throw error;
  }
}

export const uploadInspirationImage = async (userId: string, file: File): Promise<InspirationImage | null> => {
  try {
    console.log('Starting upload process for file:', file.name);
    
    // Sanitize filename and create storage path
    const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storagePath = `inspiration/${userId}/${filename}`;
    console.log('Storage path:', storagePath);
    
    const storageRef = ref(storage, storagePath);
    console.log('Storage reference created');

    // Upload file
    console.log('Starting file upload...');
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });
    console.log('File uploaded successfully');

    // Get download URL
    console.log('Getting download URL...');
    const url = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', url);

    // Create image data
    const imageData: InspirationImage = {
      id: uuidv4(),
      url,
      caption: '',
      createdAt: Timestamp.now()
    };

    // Save to Firestore
    console.log('Saving to Firestore...');
    const analysisRef = doc(db, 'colorAnalysis', userId);
    await updateDoc(analysisRef, {
      inspirationImages: arrayUnion(imageData)
    });
    console.log('Saved to Firestore successfully');

    return imageData;
  } catch (error) {
    console.error('Error in uploadInspirationImage:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return null;
  }
};

export async function deleteInspirationImage(userId: string, imageId: string) {
  try {
    const storage = getStorage();
    const imageRef = ref(storage, `inspiration/${userId}/${imageId}`);
    await deleteObject(imageRef);
    
    const analysisRef = doc(db, 'colorAnalysis', userId);
    const analysis = await getDoc(analysisRef);
    
    if (analysis.exists()) {
      const data = analysis.data();
      const updatedImages = (data.inspirationImages || []).filter(
        (img: any) => img.id !== imageId
      );
      
      await updateDoc(analysisRef, {
        inspirationImages: updatedImages,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error deleting inspiration image:', error);
    throw error;
  }
} 