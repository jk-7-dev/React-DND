import { useNavigate, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Plus, Loader2 } from 'lucide-react';

// Define the shape of data coming from Go API
interface ApiForm {
    id: number;
    name: string;
    elements: string; // JSON string
    created_at: string;
}

export function MyForms() {
  const navigate = useNavigate();

  const { data: forms, isLoading, isError } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
        const res = await axios.get<ApiForm[]>('http://localhost:8080/api/forms');
        return res.data;
    }
  });

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
      );
  }

  if (isError) {
      return <div className="text-center mt-20 text-red-500">Failed to load forms. Is the backend running?</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Forms</h1>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Create New Form
          </Link>
        </div>

        {!forms || forms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No forms yet</h3>
            <p className="text-gray-500 mt-1">Create your first form to start collecting data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => {
                // Parse elements count securely
                let elementCount = 0;
                try {
                    const elements = JSON.parse(form.elements);
                    if (Array.isArray(elements)) {
                        elementCount = elements.length;
                    }
                } catch (e) {
                    console.error("Failed to parse form elements", e);
                }

                return (
                <div key={form.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <span className="text-xs text-gray-400">{new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{form.name}</h3>
                    <p className="text-sm text-gray-500 mb-6">{elementCount} questions</p>
                    
                    <button 
                    onClick={() => navigate({ to: '/form/$formId', params: { formId: form.id.toString() } })}
                    className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition"
                    >
                    View / Fill
                    </button>
                </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}