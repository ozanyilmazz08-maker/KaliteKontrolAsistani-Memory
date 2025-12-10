import { X } from 'lucide-react';

interface DialogAction {
  label: string;
  onClick: () => void;
  color?: 'blue' | 'red' | 'gray' | 'green';
}

interface DialogProps {
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: DialogAction[];
}

export default function Dialog({ isOpen = true, onClose, title, description, children, size = 'md', actions }: DialogProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const buttonColors = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    gray: 'bg-gray-200 hover:bg-gray-300 text-gray-900'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-auto`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h3 className="text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {actions && actions.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-6 py-2 rounded-lg transition-colors ${buttonColors[action.color || 'blue']}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}