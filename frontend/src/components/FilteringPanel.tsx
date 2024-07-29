import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface FilteringPanelProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

function FilteringPanel({
  statusFilter,
  onStatusFilterChange,
}: FilteringPanelProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onStatusFilterChange(event.target.value as string);
  };

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel>Filter by Status</InputLabel>
        <Select value={statusFilter} onChange={handleChange} label="Status">
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
          <MenuItem value="Under Review">Under Review</MenuItem>
          <MenuItem value="Pending Review">Pending Review</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}

export default FilteringPanel;
