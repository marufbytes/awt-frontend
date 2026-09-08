
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-blue-600">
          <Image 
            src="/logo.jpg" 
            alt="UniCareer Connect Logo" 
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xl font-bold text-gray-900 leading-tight">
          InternNova <span className="block text-xs font-normal text-gray-500">Connect</span>
        </span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
        <Link href="#features" className="hover:text-blue-600 transition">Features</Link>
        <Link href="#students" className="hover:text-blue-600 transition">For Students</Link>
        <Link href="#employers" className="hover:text-blue-600 transition">For Employers</Link>
        <Link href="#alumni" className="hover:text-blue-600 transition">For Alumni</Link>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Link href="/auth/login" className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
          Log In
        </Link>
        <Link href="/auth/register" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Get Started
        </Link>
      </div>
    </header>
  );
}