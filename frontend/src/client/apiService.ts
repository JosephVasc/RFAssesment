import { DefaultApi } from './api/api';
import type { CSVSubmission, UpdateStatusModel } from './api/api';
import axios from 'axios';

const api = new DefaultApi(undefined, 'http://localhost:3000', axios);

// get all submissions
export const getSubmissions = async (): Promise<CSVSubmission[]> => {
  try {
    const response = await api.getSubmissionsSubmissionsGet();
    return response.data;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
};

// get a single submission by ID
export const getSubmissionById = async (
  submissionId: string,
): Promise<CSVSubmission> => {
  try {
    const response =
      await api.getSubmissionSubmissionsSubmissionIdGet(submissionId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching submission with ID ${submissionId}:`, error);
    throw error;
  }
};

// upload a CSV file
export const uploadCsv = async (file: File): Promise<CSVSubmission> => {
  try {
    const response = await api.uploadCsvUploadCsvPost(file);
    return response.data;
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
};

// update the status of a submission
export const updateSubmissionStatus = async (
  submissionId: string,
  status: string,
): Promise<CSVSubmission> => {
  try {
    const updateStatusModel: UpdateStatusModel = { status };
    const response = await api.updateSubmissionSubmissionsSubmissionIdStatusPut(
      submissionId,
      updateStatusModel,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating submission status for ID ${submissionId}:`,
      error,
    );
    throw error;
  }
};

// download a submission
export const downloadSubmission = async (
  submissionId: string,
): Promise<Blob> => {
  try {
    const response =
      await api.downloadSubmissionSubmissionsSubmissionIdDownloadGet(
        submissionId,
        { responseType: 'blob' },
      );
    return response.data;
  } catch (error) {
    console.error(
      `Error downloading submission with ID ${submissionId}:`,
      error,
    );
    throw error;
  }
};

// delete a submission
export const deleteSubmission = async (submissionId: string): Promise<void> => {
  try {
    const response =
      await api.deleteSubmissionEndpointSubmissionsSubmissionIdDelete(
        submissionId,
      );
  } catch (error) {
    console.error(
      `Error downloading submission with ID ${submissionId}:`,
      error,
    );
    throw error;
  }
};

export default {
  getSubmissions,
  getSubmissionById,
  uploadCsv,
  updateSubmissionStatus,
  downloadSubmission,
  deleteSubmission,
};
