
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4 mt-6 px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Skeleton for city name */}
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/5 sm:w-1/3 md:w-1/4 lg:w-1/5 mx-auto"></div>
      {/* Skeleton for date */}
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/5 sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto"></div>
      {/* Skeleton for main content */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-x-4 md:space-y-0">
        <div className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24 md:w-32 lg:w-40"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 md:w-24 lg:w-32"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 md:w-40 lg:w-48"></div>
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
