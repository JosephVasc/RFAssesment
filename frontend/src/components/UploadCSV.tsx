import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadCSVProps {
  file: File | null;
  onFileChange: (file: File) => void;
  handleUploadFile: () => void;
}

function UploadCSV({ file, onFileChange, handleUploadFile }: UploadCSVProps) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      onFileChange(event.target.files[0]);
    }
  }

  return (
    <Box p={2} display="flex" flexDirection="column">
      <Typography variant="h6" gutterBottom>
        Upload a CSV
      </Typography>
      <Paper
        elevation={3}
        sx={{ p: 2, width: '100%', maxWidth: 400, textAlign: 'center' }}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2, backgroundColor: '#2C2C2C' }}
        >
          Choose File
          <input type="file" accept=".csv" hidden onChange={handleFileChange} />
        </Button>
        {file && (
          <Typography variant="body2" color="textSecondary">
            {file.name}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default UploadCSV;
