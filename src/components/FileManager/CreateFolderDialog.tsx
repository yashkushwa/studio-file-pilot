
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => void;
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  isOpen,
  onClose,
  onCreateFolder
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }
    
    // Check for invalid characters
    if (/[\/\\:*?"<>|]/.test(folderName)) {
      setError('Folder name contains invalid characters');
      return;
    }
    
    onCreateFolder(folderName.trim());
    setFolderName('');
    setError('');
    onClose();
  };
  
  const handleClose = () => {
    setFolderName('');
    setError('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new folder</DialogTitle>
          <DialogDescription>
            Enter a name for the new folder.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  if (error) setError('');
                }}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
