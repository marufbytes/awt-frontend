import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 py-6 px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
      <p>© 2026 InternNova Connect. All rights reserved.</p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <Link href="/privacy" className="hover:text-gray-800 transition">Privacy Policy</Link>
        <Link href="/contact" className="hover:text-gray-800 transition">Contact Us</Link>
      </div>
    </footer>
  );
}