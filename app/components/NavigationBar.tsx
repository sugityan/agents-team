import Link from "next/link";

export default function NavigationBar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          TODO App
        </Link>
      </div>
    </nav>
  );
}