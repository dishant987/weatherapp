import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const SearchInput = ({ onSelectCity }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    useEffect(() => {
        if (input.length > 0) {
            setLoading(true);
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get(
                        `https://api.openweathermap.org/geo/1.0/direct`,
                        {
                            params: {
                                q: input,
                                limit: 5,
                                appid: import.meta.env.VITE_API_KEY,
                                lang: 'en'
                            }
                        }
                    );
                    setSuggestions(response.data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
            setLoading(false);
        }
    }, [input]);

    const handleSelectCity = (city) => {
        onSelectCity(city);
        setSelectedCity(`${city.name}, ${city.country}`);
        setSuggestions([]);
        setInput('');
    };

    return (
        <div className="relative w-full max-w-md mx-auto p-4 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={selectedCity || "Enter city name..."}
                    className="p-2 border rounded border-gray-400 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300
                               dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 placeholder-gray-700 text-sm md:text-base"
                />
                {loading && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <div className="h-2 w-2 bg-gray-700 dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-gray-700 dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-gray-700 dark:bg-white rounded-full animate-bounce"></div>
                    </div>
                )}
            </div>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className="absolute z-10 bg-white w-full dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 p-2 text-sm text-gray-500 dark:text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        Loading...
                    </motion.div>
                )}
                {!loading && suggestions.length > 0 && (
                    <motion.ul
                        className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 w-full text-left shadow-lg max-h-60 overflow-y-auto text-sm md:text-base"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {suggestions.slice(0, 5).map((city, index) => (
                            <motion.li
                                key={index} // Using index since city.id may be missing
                                onClick={() => handleSelectCity(city)}
                                className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm font-medium dark:text-white">
                                    {city.name}
                                    {city.state ? `, ${city.state}` : ''}
                                    {city.country ? `, ${city.country}` : ''}
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchInput;
