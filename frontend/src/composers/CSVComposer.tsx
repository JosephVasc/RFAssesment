import React, { useState, useEffect } from 'react';
import UploadCSVComposer from './UploadCSVComposer';
import SubmissionListComposer from './SubmissionListComposer';
import {
  getSubmissions,
  deleteSubmission,
  updateSubmissionStatus,
  downloadSubmission,
} from '../client/apiService';
import { Snackbar, Alert } from '@mui/material';

export interface Submission {
  _id: string;
  filename: string;
  status: string;
  entries: any;
  matches: number;
  total_rows: number;
  duplicates: number;
}

function CSVComposer() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );

  async function fetchSubmissions() {
    try {
      const response = await getSubmissions();
      setSubmissions(response as Submission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteSubmission(id);
      setSnackbarMessage('Submission deleted successfully.');
      setSnackbarSeverity('success');
      fetchSubmissions();
    } catch (error) {
      setSnackbarMessage('Error deleting submission.');
      setSnackbarSeverity('error');
      console.error('Error deleting submission:', error);
    } finally {
      setSnackbarOpen(true);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateSubmissionStatus(id, status);
      setSnackbarMessage('Submission status updated successfully.');
      setSnackbarSeverity('success');
      fetchSubmissions();
    } catch (error) {
      setSnackbarMessage('Error updating submission status.');
      setSnackbarSeverity('error');
      console.error('Error updating status:', error);
    } finally {
      setSnackbarOpen(true);
    }
  }

  async function handleDownload(id: string) {
    try {
      const response = await downloadSubmission(id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${id}.csv`);
      document.body.appendChild(link);
      link.click();
      setSnackbarMessage('File downloaded successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error downloading file.');
      setSnackbarSeverity('error');
      console.error('Error downloading file:', error);
    } finally {
      setSnackbarOpen(true);
    }
  }

  function handleStatusFilterChange(status: string) {
    setStatusFilter(status);
  }

  const filteredSubmissions = statusFilter
    ? submissions.filter((submission) => submission.status === statusFilter)
    : submissions;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <UploadCSVComposer onUploadSuccess={fetchSubmissions} />
      <SubmissionListComposer
        submissions={filteredSubmissions}
        onStatusChange={handleStatusChange}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onStatusFilterChange={handleStatusFilterChange}
        statusFilter={statusFilter}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CSVComposer;
