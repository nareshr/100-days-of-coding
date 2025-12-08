import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} General Purposer Tracker — Built for FAANG prep
    </footer>
  );
}
