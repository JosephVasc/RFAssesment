import { useState, MouseEvent } from 'react';
import { Box, Typography } from '@mui/material';
import MatchVisualizationModal from '../components/MatchVisualizationModal';
import FilteringPanel from '../components/FilteringPanel';
import SubmissionTable from '../components/SubmissionTable';
import { Submission } from '../composers/CSVComposer';

interface SubmissionListProps {
  submissions: Submission[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

function SubmissionList({
  submissions,
  statusFilter,
  onStatusChange,
  onDownload,
  onDelete,
  onStatusFilterChange,
}: SubmissionListProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  function handleOpenModal(submission: Submission) {
    setSelectedSubmission(submission);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setSelectedSubmission(null);
  }

  return (
    <Box p={2}>
      <FilteringPanel
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />
      {submissions.length > 0 ? (
        <SubmissionTable
          submissions={submissions}
          onStatusChange={onStatusChange}
          onDownload={onDownload}
          onDelete={onDelete}
          handleOpenModal={handleOpenModal}
        />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="20rem"
        >
          <Typography>No submissions have been found.</Typography>
        </Box>
      )}
      <MatchVisualizationModal
        submission={selectedSubmission}
        open={openModal}
        onClose={handleCloseModal}
      />
    </Box>
  );
}

export default SubmissionList;
