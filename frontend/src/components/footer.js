import React from "react";
import learnSphere from '../assets/learnSphere.png';
import { FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-50 py-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        <div className="space-y-3">
          <img src={learnSphere} alt="Learn Sphere" className="w-28 md:w-32" />
          <h3 className="font-semibold text-gray-800">Contact Us</h3>
          <div className="space-y-1">
            <p className="text-gray-600 text-sm">Call: +1108 21 104 044</p>
            <p className="text-gray-600 text-sm">CTH road, Prakash Nagar, Nemilichery, Chennai - 602 024</p>
            <p className="text-gray-600 text-sm">Email: example@mail.com</p>
          </div>
          <div className="flex gap-2 mt-3">
            {[FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance].map((Icon, index) => (
              <a 
                key={index} 
                href="#" 
                className="text-lg cursor-pointer bg-[#E9F8F3] p-2 rounded-md flex items-center justify-center hover:bg-green-100 transition-colors duration-200 text-[#20B486]"
                aria-label={`Social media icon ${index}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">Explore</h3>
          <ul className="space-y-2 mt-3">
            {['Home', 'Dashboard', 'Profile', 'Community', 'Chain Transaction', 'Setting'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-600 text-sm hover:text-green-500 transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">Category</h3>
          <ul className="space-y-2 mt-3">
            {['Design', 'Development', 'Marketing', 'Business', 'Lifestyle', 'Photography', 'Music'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-600 text-sm hover:text-green-500 transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Subscribe</h3>
          <p className="text-gray-600 text-sm">
            Join our mailing list to receive updates, course notifications, and exclusive insights right in your inbox.
          </p>
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Email here" 
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
            />
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-xs">
        <p>© {new Date().getFullYear()} Learn Sphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;