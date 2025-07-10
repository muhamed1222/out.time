import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500" aria-label="Breadcrumbs">
      <Link 
        to="/" 
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        <HomeIcon className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={item.path || index}>
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 