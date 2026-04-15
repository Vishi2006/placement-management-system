import { useState } from 'react';
import { uploadResume, deleteResume, getStudentProfile } from '../../services/studentService';

/**
 * Example Resume Upload Component
 * 
 * This component demonstrates how to use the resume upload feature.
 * Copy and integrate this into your ProfilePage or StudentDashboard component.
 */
export const ResumeUploadExample = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // Handle resume file upload
  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await uploadResume(file);
      
      if (result.success) {
        setResumeUrl(result.resume);
        setSuccess(result.message || 'Resume uploaded successfully!');
        // Refresh profile data
        const profileResult = await getStudentProfile();
        if (profileResult.success) {
          setResumeUrl(profileResult.student.resume);
        }
      } else {
        setError(result.message || 'Failed to upload resume');
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resume deletion
  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await deleteResume();
      
      if (result.success) {
        setResumeUrl('');
        setSuccess(result.message || 'Resume deleted successfully!');
      } else {
        setError(result.message || 'Failed to delete resume');
      }
    } catch (err) {
      setError(err.message || 'Delete failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Resume Upload</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            disabled={loading}
            className="hidden"
            id="resume-input"
          />
          <label
            htmlFor="resume-input"
            className={`cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-gray-600">
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          </label>
        </div>

        {/* Resume Display */}
        {resumeUrl && (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Current Resume:</p>
            <div className="flex items-center justify-between">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline truncate"
              >
                View Resume
              </a>
              <button
                onClick={handleDeleteResume}
                disabled={loading}
                className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadExample;
