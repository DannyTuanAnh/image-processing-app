import { Outlet, Link } from "react-router-dom";
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 fixed inset-0 flex items-center justify-between border-b border-gray-300 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 w-full px-8 z-10">
        <h1 className="text-2xl font-bold">Image Processor</h1>

        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-gray-500">
              Profile
            </Link>
          </li>
        </ul>
      </header>
      <main className="w-full flex-1 overflow-auto">
        <Outlet />
      </main>
      <footer className="h-16 flex items-center justify-center border-t border-gray-300 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white w-full">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Image Processor.
        </p>
      </footer>
    </div>
  );
}
