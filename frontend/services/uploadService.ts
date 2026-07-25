import api from "./api";

// ============================================
// TYPES
// ============================================

export interface UploadResponse {
  message: string;
  totalRecords: number;
  savedRecords: number;
}

// ============================================
// UPLOAD SERVICE
// ============================================

export const uploadService = {
  /**
   * Upload CSV or Excel file
   */
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
