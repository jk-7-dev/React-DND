import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LiveFormRenderer } from '../components/ui/LiveFormRenderer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { viewFormRoute } from '../router';

export function ViewForm() {
  const { formId } = viewFormRoute.useParams(); 
  
  const { data: form, isLoading, isError } = useQuery({
    queryKey: ['form', formId],
    queryFn: async () => {
        const res = await axios.get(`http://localhost:8080/api/forms/${formId}`);
        const data = res.data;
        // Parse the JSON string from DB back into an array so the renderer can use it
        if (typeof data.elements === 'string') {
            data.elements = JSON.parse(data.elements); 
        }
        return data;
    }
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  if (isError || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
        <p className="mb-4">Could not load form ID: {formId}</p>
        <Link to="/forms" className="text-blue-600 hover:underline">Return to My Forms</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Link to="/forms" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 max-w-2xl mx-auto">
        <ArrowLeft size={20} /> Back to My Forms
      </Link>
      
      <LiveFormRenderer form={form} />
    </div>
  );
}