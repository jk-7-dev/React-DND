import { useState } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { Sidebar } from '../components/builder/Sidebar';
import { Canvas } from '../components/builder/Canvas';
import { PropertiesPanel } from '../components/builder/PropertiesPanel';
import { TOOLS } from '../components/builder/tools';
import { useBuilderStore } from '../store/useBuilderStore';
import type { ElementType } from '../types';

export function Builder() {
  const { addElement, reorderElements, elements } = useBuilderStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const navigate = useNavigate();

  // React Query Mutation to Save Form to Go Backend
  const saveMutation = useMutation({
    mutationFn: async (newForm: { name: string; elements: string }) => {
      // Ensure your Go backend is running on port 8080
      return axios.post('http://localhost:8080/api/forms', newForm);
    },
    onSuccess: () => {
      setIsModalOpen(false);
      // Use navigate with the 'to' property for TanStack Router
      navigate({ to: '/forms' });
    },
    onError: (error) => {
        console.error("Save failed", error);
        alert("Failed to save form. Is the backend running?");
    }
  });

  const handleSave = () => {
    if (!formName.trim()) return;
    
    // Convert elements array to JSON string for storage in SQLite
    const elementsJson = JSON.stringify(elements);
    
    saveMutation.mutate({
        name: formName,
        elements: elementsJson
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === 'CANVAS' && destination.droppableId === 'CANVAS') {
      reorderElements(source.index, destination.index);
    }
    if (source.droppableId === 'SIDEBAR' && destination.droppableId === 'CANVAS') {
      const tool = TOOLS[source.index];
      addElement(destination.index, {
        id: uuidv4(),
        type: tool.type as ElementType,
        label: tool.label,
        required: false,
        placeholder: '',
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen w-full flex-col bg-gray-50">
        <header className="flex items-center justify-between border-b px-6 py-4 bg-white shadow-sm z-10">
          <h1 className="text-xl font-bold text-gray-800">New Form</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate({ to: '/forms' })} 
              className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded text-sm"
            >
                My Forms
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                disabled={elements.length === 0 || saveMutation.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveMutation.isPending ? "Saving..." : "Save Form"}
            </button>
          </div>
        </header>
        
        <main className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertiesPanel />
        </main>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-lg font-bold mb-4">Name your form</h2>
                    <input 
                        className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g., Job Application"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {saveMutation.isPending ? "Saving..." : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </DragDropContext>
  );
}