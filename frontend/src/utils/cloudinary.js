/**
 * Upload file to server which then uploads to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Response with file URL
 */
export const uploadResume = async (file, token) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimes.includes(file.type)) {
      throw new Error('Only PDF and Word documents (DOC, DOCX) are allowed');
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('resume', file);

    // Upload to backend which will handle Cloudinary upload
    const response = await fetch('http://localhost:5000/api/students/resume/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      resume: data.resume,
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Upload failed'
    };
  }
};
