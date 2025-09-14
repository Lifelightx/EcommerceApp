import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin,CreditCard,UserCheck,TrophyIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-8 border-b border-gray-700">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">ShopEase</h2>
          <p className="mt-4 text-sm">
            Your one-stop shop for electronics, fashion, and more.
            We bring quality products right to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/shop" className="hover:text-white">Shop</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            <li><a href="/returns" className="hover:text-white">Returns</a></li>
            <li><a href="/shipping" className="hover:text-white">Shipping Info</a></li>
            <li><a href="/support" className="hover:text-white">Support</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Mumbai, India
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@shopease.com
            </li>
          </ul>
          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-white"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white"><Twitter size={20} /></a>
            <a href="#" className="hover:text-white"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p>© {new Date().getFullYear()} ApStore. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <CreditCard size={16} />
          <UserCheck size={16} />
          <TrophyIcon size={16} />
        </div>
      </div>
    </footer>
  );
}
