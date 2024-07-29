import React, { useState, useEffect } from 'react';
import UploadCSV from '../components/UploadCSV';
import { uploadCsv } from '../client/apiService';
import { Snackbar, Alert } from '@mui/material';

interface UploadCSVComposerProps {
  onUploadSuccess: () => void;
}

function UploadCSVComposer({ onUploadSuccess }: UploadCSVComposerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );

  useEffect(() => {
    if (file) {
      handleUploadFile();
    }
  }, [file]);

  function handleFileChange(file: File) {
    setFile(file);
  }

  async function handleUploadFile() {
    if (file) {
      try {
        await uploadCsv(file);
        setSnackbarMessage(`File uploaded successfully!`);
        setSnackbarSeverity('success');
        onUploadSuccess();
      } catch (error) {
        setSnackbarMessage('Error uploading file.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    }
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  return (
    <>
      <UploadCSV
        file={file}
        onFileChange={handleFileChange}
        handleUploadFile={handleUploadFile}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UploadCSVComposer;
