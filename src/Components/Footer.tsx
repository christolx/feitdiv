// src/Components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 py-6 ">
            <div className="container mx-auto text-center">
                <h2 className="text-white text-lg font-semibold mb-4">Connect with us</h2>
                <div className="flex justify-center space-x-4">
                    <a href="mailto:support@example.com" className="text-gray-400 hover:text-white transition-colors">Email</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                </div>
                <p className="mt-4 text-gray-500 text-sm">© 2024 Your Company Name. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
