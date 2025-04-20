
import FileManager from "@/components/FileManager/FileManager";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Studio File Pilot</h1>
        </div>
      </header>
      
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
          <FileManager basePath="/teamspace/studios/this_studio" />
        </div>
      </main>
      
      <footer className="bg-white shadow-inner">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Studio File Pilot - An advanced file management system
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
