// components/SkeletonLoader.js
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4 mt-6">
      {/* Skeleton for city name */}
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
      {/* Skeleton for date */}
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
      {/* Skeleton for main content */}
      <div className="flex items-center justify-center space-x-4">
        <div className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
      {/* Skeleton for forecast */}
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="flex-1 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
