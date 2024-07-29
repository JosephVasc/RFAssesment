import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Editor } from '@monaco-editor/react';

interface FileViewerModalProps {
  open: boolean;
  onClose: () => void;
  fileContent: string;
  filename: string;
}

function FileViewerModal({
  open,
  onClose,
  fileContent,
  filename,
}: FileViewerModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          outline: 0,
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            width: '80%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">{filename}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Editor
            height="70vh"
            defaultLanguage="plaintext"
            value={fileContent}
            options={{
              readOnly: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              renderWhitespace: 'all',
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default FileViewerModal;
