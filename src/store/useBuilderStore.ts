import { create } from 'zustand';
import type { FormElement } from '../types';

export interface SavedForm {
  id: string;
  name: string;
  createdAt: string;
  elements: FormElement[];
}

interface BuilderStore {
  elements: FormElement[];
  selectedElement: FormElement | null;
  savedForms: SavedForm[]; // <--- NEW: Store saved forms

  addElement: (index: number, element: FormElement) => void;
  removeElement: (id: string) => void;
  reorderElements: (startIndex: number, endIndex: number) => void;
  setSelectedElement: (element: FormElement | null) => void;
  updateElement: (id: string, updates: Partial<FormElement>) => void;
  
  saveForm: (name: string) => void; // <--- NEW ACTION
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  elements: [],
  selectedElement: null,
  savedForms: [],

  addElement: (index, element) =>
    set((state) => {
      const newElements = [...state.elements];
      newElements.splice(index, 0, element);
      return { elements: newElements, selectedElement: element };
    }),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElement: state.selectedElement?.id === id ? null : state.selectedElement
    })),

  reorderElements: (startIndex, endIndex) =>
    set((state) => {
      const result = [...state.elements];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { elements: result };
    }),

  setSelectedElement: (element) => set(() => ({ selectedElement: element })),

  updateElement: (id, updates) =>
    set((state) => {
      const newElements = state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      return {
        elements: newElements,
        selectedElement: state.selectedElement?.id === id ? { ...state.selectedElement, ...updates } : state.selectedElement
      };
    }),

  // NEW: Save the current elements as a new Form
  saveForm: (name) => {
    const { elements } = get();
    const newForm: SavedForm = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toLocaleDateString(),
      elements: [...elements], // Deep copy elements
    };

    set((state) => ({
      savedForms: [newForm, ...state.savedForms], // Add to top of list
      elements: [], // Clear canvas after save
      selectedElement: null
    }));
  }
}));