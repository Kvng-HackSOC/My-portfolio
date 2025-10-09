import ApiTestComponent from '@/components/ApiTestComponent';

export default function TestConnectionPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Connection Test Page</h1>
      <ApiTestComponent />
    </div>
  );
}