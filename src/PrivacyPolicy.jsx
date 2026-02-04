import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-white font-['Inter']">
      {/* Header */}
      <div className="bg-[#1e1e1e] border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-emerald-500 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Login</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl mb-6">
            <Shield className="text-emerald-500" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm">
            Last updated: <span className="text-emerald-500 font-bold">6 February 2026</span>
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {/* Introduction */}
          <section>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy describes how{" "}
              <span className="text-emerald-500 font-bold">Quick Commerce</span>{" "}
              ("the App") handles user information.
            </p>
          </section>

          {/* Information We Do Not Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Information We Do Not Collect</span>
            </h2>
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="text-gray-300">
                    We do not collect personal information
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="text-gray-300">
                    We do not collect names, email addresses, or phone numbers
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="text-gray-300">
                    We do not track user activity
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="text-gray-300">
                    We do not store any data on servers
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-gray-400 leading-relaxed">
              The app works without requiring user registration and does not
              collect any form of user data.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Third-Party Services</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              This app does not use any third-party services that collect user
              data.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Children's Privacy</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              This app is safe for all age groups. Since no data is collected,
              there is no risk of collecting personal information from children
              under 13.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Changes to This Policy</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page.
            </p>
          </section>

          {/* Contact Us */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Contact Us</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, you can
              contact us at:
            </p>
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="text-emerald-500" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:amresh@example.com"
                    className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors"
                  >
                    amresh.kipm@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © 2026 Quick Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
