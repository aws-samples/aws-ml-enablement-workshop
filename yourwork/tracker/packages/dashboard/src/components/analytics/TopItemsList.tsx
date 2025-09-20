import React from 'react';

interface TopItem {
  name: string;
  count: number;
  percentage: number;
}

interface TopItemsListProps {
  title: string;
  items: TopItem[];
  className?: string;
  type?: 'events' | 'pages';
}

export const TopItemsList: React.FC<TopItemsListProps> = ({ 
  title, 
  items, 
  className = '',
  type = 'events'
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pages':
        return '📄';
      default:
        return '🎯';
    }
  };

  const formatItemName = (name: string, type: string) => {
    if (type === 'pages' && name.startsWith('view:')) {
      return name.replace('view:', '');
    }
    return name;
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <span className="mr-2">{getIcon(type)}</span>
        {title}
      </h3>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <span className="flex-shrink-0 w-6 text-sm font-medium text-gray-500">
                  {index + 1}.
                </span>
                <span className="ml-3 text-sm font-medium text-gray-900 truncate">
                  {formatItemName(item.name, type)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {item.count.toLocaleString()}
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {items.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            and {items.length - 5} more...
          </p>
        </div>
      )}
    </div>
  );
};