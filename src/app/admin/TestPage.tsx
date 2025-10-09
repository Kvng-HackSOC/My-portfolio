export default function AdminPage() {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel Test</h1>
          <p className="mt-4 text-gray-600">If you can see this, the admin route is working!</p>
          <div className="mt-8 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800">Admin panel is accessible at /admin</p>
          </div>
        </div>
      </div>
    );
  }