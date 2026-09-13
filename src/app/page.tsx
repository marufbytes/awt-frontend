import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBuildingUser, faHandshake } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="flex-grow max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your Gateway to Career Success
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Bridge the Gap Between Campus and Career
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            The ultimate platform for students, alumni, and employers to connect, collaborate, and recruit.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/auth/register" className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl shadow-sm hover:bg-blue-600 transition">
              I'm a Student
            </Link>
            <Link href="/auth/register" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">
              I'm an Employer
            </Link>
          </div>
        </div>

        {/* Hero image section */}
        <div className="relative w-full h-[350px] md:h-[420px] rounded-3xl overflow-hidden shadow-sm border border-blue-100/50">
          <Image 
            src="/home_photo.jpg" 
            alt="Hero Career Illustration" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* How It Works  */}
      <section className="bg-gray-50/50 py-16 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col items-start">
              <div className="p-3 bg-blue-50 rounded-xl mb-4">
                <FontAwesomeIcon icon={faUserGraduate} className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Students</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Build profiles, find internships, and apply to top jobs seamlessly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col items-start">
              <div className="p-3 bg-blue-50 rounded-xl mb-4">
                <FontAwesomeIcon icon={faBuildingUser} className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Employers</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Post job openings, review candidates, and schedule interviews with ease.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col items-start">
              <div className="p-3 bg-blue-50 rounded-xl mb-4">
                <FontAwesomeIcon icon={faHandshake} className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Alumni</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect with mentors, explore career paths, and give back to juniors.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Trusted by Leading Companies */}
      <section className="py-12 bg-white text-center">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted by Leading Companies
        </h3>
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale font-semibold text-xl text-gray-500">
          <span>TechCorp Solutions</span>
          <span>Innovatech</span>
          <span>Global Interns</span>
          <span>UniConnect</span>
          <span>Tsh Alurret</span>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}