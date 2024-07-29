import SubmissionList from '../components/SubmissionList';
import { Submission } from './CSVComposer';

interface SubmissionListComposerProps {
  submissions: Submission[];
  onStatusChange: (id: string, status: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusFilterChange: (status: string) => void;
  statusFilter: string;
}

function SubmissionListComposer({
  submissions,
  onStatusChange,
  onDownload,
  onDelete,
  onStatusFilterChange,
  statusFilter,
}: SubmissionListComposerProps) {
  return (
    <>
      <SubmissionList
        submissions={submissions}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        onStatusChange={onStatusChange}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    </>
  );
}

export default SubmissionListComposer;
