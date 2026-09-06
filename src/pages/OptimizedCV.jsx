import { useLocation } from 'react-router-dom';

const OptimizedCV = () => {
  const { state } = useLocation();
  const optimizedText = state?.optimizedText;

  if (!optimizedText) {
    return (
      <div className="p-20 text-center text-xl font-bold">
        جاري معالجة سيرتك الذاتية بواسطة الذكاء الاصطناعي... يرجى الانتظار
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Your ATS-Optimized CV</h1>
        
        {/* نستخدم white-space: pre-wrap للحفاظ على تنسيق الـ AI */}
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
          {optimizedText}
        </div>

        <button 
          onClick={() => navigator.clipboard.writeText(optimizedText)}
          className="mt-8 w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default OptimizedCV;