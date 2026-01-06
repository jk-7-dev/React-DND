import { useState } from 'react';
import type { FormElement } from '../../types';
import { VideoRecorder } from '../form-elements/VideoRecorder';

// Define a Union Type for all possible form values
type FormValue = string | number | Blob | null;

export function LiveFormRenderer({ form }: { form: { name: string; elements: FormElement[] } }) {
  // Use the specific type instead of 'any'
  const [formData, setFormData] = useState<Record<string, FormValue>>({});

  // Type the value argument properly
  const handleChange = (id: string, value: FormValue) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted to Backend:", formData);
    alert("Form Submitted! Check console for data.");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg my-10 border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">{form.name}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.elements.map((el) => (
          <div key={el.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {el.label} {el.required && <span className="text-red-500">*</span>}
            </label>

            {/* TEXT / EMAIL / PHONE inputs */}
            {['text', 'email', 'phone'].includes(el.type) && (
              <input 
                type={el.type === 'phone' ? 'tel' : el.type}
                required={el.required}
                placeholder={el.placeholder}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => handleChange(el.id, e.target.value)}
              />
            )}
            
            {/* TEXTAREA */}
            {el.type === 'textarea' && (
              <textarea 
                required={el.required}
                placeholder={el.placeholder}
                rows={4}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => handleChange(el.id, e.target.value)}
              />
            )}

            {/* DATE */}
            {el.type === 'date' && (
              <input 
                type="date"
                required={el.required}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => handleChange(el.id, e.target.value)}
              />
            )}

            {/* SELECT (Dropdown) */}
            {el.type === 'select' && (
               <select 
                 required={el.required}
                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                 onChange={(e) => handleChange(el.id, e.target.value)}
                 defaultValue=""
               >
                 <option value="" disabled>Select an option</option>
                 <option value="Option 1">Option 1</option>
                 <option value="Option 2">Option 2</option>
                 <option value="Option 3">Option 3</option>
               </select>
            )}

            {/* REVIEW STARS */}
            {el.type === 'stars' && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange(el.id, star)}
                    className={`text-2xl transition-colors focus:outline-none ${
                      (formData[el.id] as number) >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            )}

            {/* VIDEO RECORDER */}
            {el.type === 'video' && (
              <VideoRecorder onSave={(blob) => handleChange(el.id, blob)} />
            )}
          </div>
        ))}

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
}