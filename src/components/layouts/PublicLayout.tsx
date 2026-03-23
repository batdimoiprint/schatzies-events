import {  Outlet } from 'react-router-dom';


export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Component */}
      <header className="bg-white shadow">
        
      </header>

      {/* Main content area with outlet for child routes */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
