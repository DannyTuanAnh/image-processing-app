import { Outlet, Link } from "react-router-dom";
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 fixed inset-0 flex items-center justify-between border-b border-gray-300 bg-white w-full px-8 z-10">
        <h1 className="text-2xl font-bold">Image Processor</h1>

        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </li>
        </ul>
      </header>
      <main className="w-full flex-1 overflow-auto py-8 mt-16">
        <Outlet />
      </main>
      <footer className="h-16 flex items-center justify-center border-t border-gray-300 bg-white w-full">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Image Processor. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
