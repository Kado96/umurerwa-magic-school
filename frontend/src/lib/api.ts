export interface Student {
  id: string | number;
  first_name: string;
  last_name: string;
  class_name?: string;
  matricule?: string;
}

export interface Assessment {
  id: string | number;
  subject_name: string;
  date: string;
  max_score: number;
}

export interface GradePayload {
  student_id: string | number;
  score: number;
}

export interface Payment {
  id: string | number;
  receipt_number?: string;
  date: string;
  student_name: string;
  student_class_name?: string;
  payment_type: string;
  amount: number;
  method: string;
  reference?: string;
}

export interface Grade {
  id?: string | number;
  student_id: string | number;
  assessment_id: string | number;
  assessment?: Assessment;
  score: number;
}

const BASE_URL = "http://localhost:8000";

/**
 * Appel vers les endpoints de l'API School : /api/school/...
 * Usage: fetchApi("/students/")  → GET http://localhost:8000/api/school/students/
 */
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  return _fetch(`${BASE_URL}/api/school${endpoint}`, options);
};

/**
 * Appel vers les endpoints de l'API Accounts : /api/accounts/...
 * Usage: fetchAccountsApi("/login/")  → POST http://localhost:8000/api/accounts/login/
 */
export const fetchAccountsApi = async (endpoint: string, options: RequestInit = {}) => {
  return _fetch(`${BASE_URL}/api/accounts${endpoint}`, options);
};

export const uploadMedia = async (file: File, category: string = "general"): Promise<{ url: string; relative_url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/school/media/upload/?category=${category}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) throw new Error("Échec du téléversement du média");
  return res.json();
};

export const fetchFile = async (endpoint: string): Promise<Blob> => {
  const token = localStorage.getItem("access_token");
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${BASE_URL}/api/school${endpoint}`, {
    headers,
  });
  if (!response.ok) throw new Error("Erreur de téléchargement");
  return response.blob();
};

/** Fonction interne partagée */
const _fetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    const errorData = await response.json().catch(() => ({}));
    let message = errorData.detail || errorData.message || errorData.error;
    
    if (!message && typeof errorData === 'object' && Object.keys(errorData).length > 0) {
      const messages: string[] = [];
      for (const [key, value] of Object.entries(errorData)) {
        const valStr = Array.isArray(value) ? value.join(", ") : String(value);
        messages.push(`${key}: ${valStr}`);
      }
      message = messages.join(" | ");
    }
    
    if (!message) {
      message = `Erreur ${response.status}: Une erreur est survenue avec le serveur.`;
    }

    const err = new Error(message);
    (err as any).status = response.status;
    (err as any).data = errorData;
    throw err;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/** Ancien alias conservé pour compatibilité si des pages l'utilisent directement */
export const API_URL = `${BASE_URL}/api/school`;

export const getAssessments = () => fetchApi("/assessments/");
export const submitBatchGrades = (assessmentId: string, grades: GradePayload[]) => 
    fetchApi(`/assessments/${assessmentId}/batch-grades/`, {
        method: 'POST',
        body: JSON.stringify({ grades })
    });
export const getPayments = () => fetchApi("/payments/");
