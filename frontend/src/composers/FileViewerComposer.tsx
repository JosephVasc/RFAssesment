import React, { useState } from 'react';
import FileViewerModal from '../components/FileViewerModal';
import { downloadSubmission } from '../client/apiService';
import { MenuItem } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

interface FileViewerComposerProps {
  fileId: string;
  filename: string;
  onClose: () => void;
}

function FileViewerComposer({
  fileId,
  filename,
  onClose,
}: FileViewerComposerProps) {
  const [open, setOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string>('');

  async function handleOpen() {
    try {
      const blob = await downloadSubmission(fileId);
      const content = await blob.text();
      setFileContent(content);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <FolderOpenIcon /> View File
      </MenuItem>
      <FileViewerModal
        open={open}
        onClose={handleClose}
        fileContent={fileContent}
        filename={filename}
      />
    </>
  );
}

export default FileViewerComposer;
