'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className="bg-white border-t border-gray-100 py-8 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 InternNova Connect. All rights reserved.</p>
          
          <div className="flex space-x-6 mt-4 sm:mt-0">
            
            <label htmlFor="privacy-modal" className="hover:text-blue-600 transition cursor-pointer">
              Privacy Policy
            </label>
            <label htmlFor="contact-modal" className="hover:text-blue-600 transition cursor-pointer">
              Contact Us
            </label>
          </div>
        </div>
      </footer>

      
      
      <input type="checkbox" id="privacy-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-gray-900">Privacy Policy</h3>
          <p className="py-4 text-sm text-gray-600">
            At InternNova Connect, your privacy is our top priority. We protect user credentials securely via token-based authentication on our NestJS backend without storing plain-text passwords.
          </p>
          <div className="modal-action">
            <label htmlFor="privacy-modal" className="btn btn-sm">Close</label>
          </div>
        </div>
      </div>

      
      
      <input type="checkbox" id="contact-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-gray-900">Contact Us</h3>
          <p className="py-2 text-sm text-gray-600">Have questions or feedback? Send us a message below.</p>
          
          <form action="https://formspree.io/f/xgaepbey" method="POST" className="space-y-4 mt-2">
            <div>
              <label className="label text-xs uppercase font-semibold">Your Name</label>
              <input required type="text" name="name" placeholder="Maruf Ahammed" className="input input-bordered w-full" />
            </div>
            <div>
              <label className="label text-xs uppercase font-semibold">Email Address</label>
              <input required type="email" name="email" placeholder="maruf@aiub.edu" className="input input-bordered w-full" />
            </div>
            <div>
              <label className="label text-xs uppercase font-semibold">Message</label>
              <textarea required name="message" rows={3} placeholder="Write your message..." className="textarea textarea-bordered w-full"></textarea>
            </div>
            
            <div className="modal-action">
              <button type="submit" className="btn btn-primary text-white">Send Message</button>
              <label htmlFor="contact-modal" className="btn">Cancel</label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}