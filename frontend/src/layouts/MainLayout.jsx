import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)', transition: 'background-color 200ms' }}
    >
      {/* Fixed Sidebar — w-60 */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col ml-60 overflow-hidden min-w-0">
        <Navbar />
        <main
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{ backgroundColor: 'var(--color-bg)', transition: 'background-color 200ms' }}
        >
          <div className="animate-fade-in max-w-screen-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
