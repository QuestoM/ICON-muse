'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Pencil, Save, Trash2, Plus, X, Upload } from 'lucide-react';
import { savePersonalNote, deletePersonalNote, uploadInspirationImage, deleteInspirationImage } from '@/lib/firebase/colorAnalysisUtils';
import { Timestamp } from 'firebase/firestore';
import { ColorAnalysis, InspirationImage } from '@/lib/types/color';

interface PersonalNotesProps {
  analysis: ColorAnalysis;
}

interface Note {
  id: string;
  text: string;
  createdAt: Timestamp;
  createdBy: string;
}

export default function PersonalNotes({ analysis }: PersonalNotesProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [images, setImages] = useState<InspirationImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<InspirationImage | null>(null);

  useEffect(() => {
    if (analysis.personalNotes) {
      setNotes(analysis.personalNotes.map(note => ({
        ...note,
        createdAt: note.createdAt as unknown as Timestamp
      })));
    }
    if (analysis.inspirationImages) {
      setImages(analysis.inspirationImages);
    }
  }, [analysis]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return;

    const noteData = {
      id: crypto.randomUUID(),
      text: newNote,
      createdAt: Timestamp.now(),
      createdBy: user.email || 'Unknown',
    };

    try {
      await savePersonalNote(user.uid, noteData);
      setNotes([...notes, noteData]);
      setNewNote('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEditNote = async (noteId: string) => {
    if (!user) return;

    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    setEditingNoteId(noteId);
    setEditingNoteText(note.text);
  };

  const handleSaveEdit = async (noteId: string) => {
    if (!user || !editingNoteText.trim()) return;

    try {
      const updatedNote = {
        ...notes.find(n => n.id === noteId)!,
        text: editingNoteText,
      };

      await savePersonalNote(user.uid, updatedNote, true);
      setNotes(notes.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      setEditingNoteId(null);
      setEditingNoteText('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      await deletePersonalNote(user.uid, noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !user) return;
    
    setIsUploading(true);
    try {
      const files = Array.from(event.target.files);
      console.log('Starting upload of', files.length, 'files');

      const uploadPromises = files.map(async (file) => {
        try {
          const result = await uploadInspirationImage(user.uid, file);
          console.log('Upload successful for file:', file.name);
          return result;
        } catch (error) {
          console.error('Error uploading file:', file.name, error);
          return null;
        }
      });

      const uploadedImages = (await Promise.all(uploadPromises))
        .filter((img: InspirationImage | null): img is InspirationImage => img !== null && img.createdAt instanceof Timestamp);
      console.log('All uploads completed:', uploadedImages.length, 'successful');

      if (uploadedImages.length > 0) {
        setImages(prevImages => [...prevImages, ...uploadedImages]);
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!user) return;

    try {
      await deleteInspirationImage(user.uid, imageId);
      setImages(images.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notes Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Stylist Notes</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="flex-1 min-h-[100px] p-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 resize-none"
            />
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 bg-gray-800/30 rounded-lg space-y-2">
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      className="w-full min-h-[100px] p-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="p-2 text-gray-400 hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="p-2 text-green-400 hover:text-green-300"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-300">{note.text}</p>
                      <div className="text-sm text-gray-500 mt-2">
                        Added by {note.createdBy} on {note.createdAt.toDate().toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(note.id)}
                        className="p-1 text-gray-400 hover:text-blue-400"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Gallery Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Inspiration Gallery</h3>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg">
              <Upload className="w-4 h-4" />
              Upload Images
            </div>
          </label>
        </div>

        {isUploading && (
          <div className="text-center py-4 text-gray-400">
            Uploading images...
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image.id);
                  }}
                  className="absolute top-2 right-2 p-2 text-white hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
} 