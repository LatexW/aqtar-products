export default function ProductLoading() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80 md:h-96 w-full bg-gray-200 rounded"></div>
        <div className="flex flex-col">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          
          <div className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          <div className="mt-auto flex space-x-4">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 