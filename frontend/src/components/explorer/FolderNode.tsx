import { IconFile, IconFolder, IconFolderFilled, IconTrash } from '@tabler/icons-react';
import { entity } from '../../../wailsjs/go/models';
import { DeleteItems } from '../../../wailsjs/go/main/App';
import { convertBytes } from '../../utils/convertBytes';
import clsxm from '../../utils/clsxm';
import { useState } from 'react';

const FolderNode = ({
  entry,
  level,
  expandedPaths,
  onExpand,
  showSize = false,
  showFiles = true,
  allowDelete = false,
}: {
  entry: entity.DirEntry;
  level: number;
  expandedPaths?: string[];
  onExpand: (entry: entity.DirEntry, level: number) => void;
  showSize?: boolean;
  showFiles?: boolean;
  allowDelete?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!entry) return null;
  const isExpanded = expandedPaths ? expandedPaths[level] === entry.path : false;
  const size = convertBytes(entry.size);
  const sizeClass = size.includes('TB')
    ? 'text-red-500'
    : size.includes('GB')
      ? 'text-orange-500'
      : size.includes('MB')
        ? 'text-yellow-500'
        : size.includes('KB')
          ? 'text-green-500'
          : size.includes('B')
            ? 'text-blue-500'
            : '';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmMessage = entry.isDir 
      ? `Êtes-vous sûr de vouloir supprimer le dossier "${entry.name}" et tout son contenu ?`
      : `Êtes-vous sûr de vouloir supprimer le fichier "${entry.name}" ?`;
    
    if (!confirm(confirmMessage)) return;

    setIsDeleting(true);
    try {
      const deletionRequest = entity.DeletionRequest.createFrom({
        paths: [entry.path],
        force: entry.isDir, // Force deletion for directories
      });
      
      const result = await DeleteItems(deletionRequest);
      
      if (result.successCount > 0) {
        // Emit a custom event to notify parent components about the deletion
        window.dispatchEvent(new CustomEvent('itemDeleted', { 
          detail: { path: entry.path, summary: result } 
        }));
      } else {
        alert(`Erreur lors de la suppression : ${result.results[0]?.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showFiles && !entry.isDir) return null;
  
  return (
    <div className="ml-4">
      <div
        className={clsxm(
          entry.isDir && 'cursor-pointer', 
          'flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 group relative',
          isDeleting && 'opacity-50 pointer-events-none'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !isDeleting && onExpand(entry, level)}
      >
        {entry.isDir ? (
          isExpanded ? (
            <IconFolderFilled className={clsxm(showSize && sizeClass)} />
          ) : (
            <IconFolder className={clsxm(showSize && sizeClass)} />
          )
        ) : (
          <IconFile className={clsxm(showSize && sizeClass)} />
        )}
        <span className="flex-1">{entry.name || entry.path}</span>
        {showSize && <span className="ml-2 text-xs text-gray-500">{size}</span>}
        
        {allowDelete && isHovered && !isDeleting && (
          <button
            onClick={handleDelete}
            className="ml-2 p-1 rounded hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors"
            title={`Supprimer ${entry.isDir ? 'le dossier' : 'le fichier'}`}
          >
            <IconTrash size={16} />
          </button>
        )}
        
        {isDeleting && (
          <span className="ml-2 text-xs text-gray-500">Suppression...</span>
        )}
      </div>
      {entry.isDir && isExpanded && entry.children && (
        <div>
          {entry.children.map((child: entity.DirEntry) => (
            <FolderNode
              key={child.path}
              entry={child}
              level={level + 1}
              expandedPaths={expandedPaths}
              onExpand={onExpand}
              showSize={showSize}
              showFiles={showFiles}
              allowDelete={allowDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderNode;
