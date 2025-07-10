import React from 'react';
import { Link } from 'react-router-dom';

const illustrations = {
  default: '/illustrations/empty-box.svg',
  search: '/illustrations/empty-search.svg',
  error: '/illustrations/error.svg',
  noData: '/illustrations/no-data.svg',
  noAccess: '/illustrations/no-access.svg',
};

const EmptyState = ({
  title,
  description,
  illustration = 'default',
  action,
  actionLink,
  actionText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <img
        src={illustrations[illustration] || illustrations.default}
        alt={title}
        className="w-64 h-64 mb-6"
      />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {actionText}
        </button>
      )}
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState; 