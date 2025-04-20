
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { buildBreadcrumbs } from '@/utils/fileUtils';

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  const breadcrumbs = buildBreadcrumbs(path);
  
  return (
    <div className="flex items-center p-2 overflow-x-auto whitespace-nowrap">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-1 text-gray-500" />
          )}
          <button
            className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${
              index === breadcrumbs.length - 1
                ? 'text-indigo-600 font-medium'
                : 'text-gray-600'
            }`}
            onClick={() => onNavigate(crumb.path)}
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
