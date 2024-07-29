import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import { Submission } from '../composers/CSVComposer';

interface MatchVisualizationModalProps {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
}

function MatchVisualizationModal({
  submission,
  open,
  onClose,
}: MatchVisualizationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries =
    submission?.entries.filter((entry: any) =>
      entry.company_name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        {submission ? (
          <>
            <Box mb={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {submission.filename}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    Total Rows: {submission.total_rows}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    Matches: {submission.matches}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    Duplicates: {submission.duplicates}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Search by Company Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <TableContainer component={Paper} sx={{ height: '50vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Row</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Match</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.map((entry: any, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: entry.matched_entity
                          ? '#d4edda'
                          : '#f8d7da',
                      }}
                    >
                      <TableCell>{entry.row_number}</TableCell>
                      <TableCell>{entry.company_name}</TableCell>
                      <TableCell>{entry.matched_entity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography variant="body1">No submission data available.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MatchVisualizationModal;
