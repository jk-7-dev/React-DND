import { Link } from '@tanstack/react-router';
import { useBuilderStore } from '../store/useBuilderStore';
import { LiveFormRenderer } from '../components/ui/LiveFormRenderer';
import { ArrowLeft } from 'lucide-react';
import { viewFormRoute } from '../router'; // <--- Import the route definition

export function ViewForm() {
  // Use the hook specifically bound to this route
  const { formId } = viewFormRoute.useParams(); 
  
  const { savedForms } = useBuilderStore();
  const form = savedForms.find(f => f.id === formId);

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
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