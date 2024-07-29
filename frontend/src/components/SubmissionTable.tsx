import { useState, MouseEvent } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Link,
  FormControl,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DownloadIcon from '@mui/icons-material/Download';
import FileViewerComposer from '../composers/FileViewerComposer';
import { Submission } from '../composers/CSVComposer';
import { SubmissionStatus } from '../utils/enum';

interface SubmissionTableProps {
  submissions: Submission[];
  onStatusChange: (id: string, status: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  handleOpenModal: (submission: Submission) => void;
}

const statusColors: { [key in SubmissionStatus]: string } = {
  [SubmissionStatus.Approved]: 'success.main',
  [SubmissionStatus.Rejected]: 'error.main',
  [SubmissionStatus.UnderReview]: 'warning.main',
  [SubmissionStatus.PendingReview]: 'info.main',
};

function SubmissionTable({
  submissions,
  onStatusChange,
  onDownload,
  onDelete,
  handleOpenModal,
}: SubmissionTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(
    null,
  );

  function handleMenuOpen(event: MouseEvent<HTMLElement>, id: string) {
    setAnchorEl(event.currentTarget);
    setCurrentSubmissionId(id);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setCurrentSubmissionId(null);
  }

  function handleStatusChange(event: SelectChangeEvent<string>, id: string) {
    onStatusChange(id, event.target.value as string);
  }

  function handleDownload() {
    if (currentSubmissionId) {
      onDownload(currentSubmissionId);
    }
    handleMenuClose();
  }

  function handleDelete() {
    if (currentSubmissionId) {
      onDelete(currentSubmissionId);
    }
    handleMenuClose();
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Filename</TableCell>
            <TableCell>Match Results</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id}>
              <TableCell>{submission._id}</TableCell>
              <TableCell>{submission.filename}</TableCell>
              <TableCell>
                <Tooltip title="View File Matches">
                  <Link
                    component="button"
                    onClick={() => handleOpenModal(submission)}
                    color="inherit"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    View Match Results
                  </Link>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Update File Status">
                  <FormControl fullWidth>
                    <Select
                      value={submission.status}
                      onChange={(event) =>
                        handleStatusChange(event, submission._id)
                      }
                      displayEmpty
                      inputProps={{ 'aria-label': 'Submission Status' }}
                    >
                      {Object.values(SubmissionStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                          <Typography sx={{ color: statusColors[status] }}>
                            {status}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Actions">
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, submission._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={
                    Boolean(anchorEl) && currentSubmissionId === submission._id
                  }
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDownload}>
                    <DownloadIcon sx={{ mr: 1 }} /> Download
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <HighlightOffIcon sx={{ mr: 1 }} /> Delete
                  </MenuItem>
                  <FileViewerComposer
                    fileId={submission._id}
                    filename={submission.filename}
                    onClose={handleMenuClose}
                  />
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SubmissionTable;
