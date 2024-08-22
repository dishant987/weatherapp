import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    return (
        <footer className={`py-3 px-4 fixed bottom-0 w-full text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
            } transition-colors duration-300`}>
            <div className="container mx-auto px-4">
                <p>
                    © {new Date().getFullYear()} Weather App Built ❤️ by <a href="https://www.linkedin.com/in/dishant-tank-25a421224/">Dishant</a>
                </p>

            </div>
        </footer>
    );
};

export default Footer;
