import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user?: User;
}

export interface TodosResponse {
  data: Todo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Auth API functions
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
};

// Todo API functions
export const todoAPI = {
  getTodos: async (page: number = 1, limit: number = 10, completed?: boolean): Promise<TodosResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (completed !== undefined) {
      params.append('completed', completed.toString());
    }
    
    const response = await api.get(`/api/todos?${params.toString()}`);
    return response.data;
  },

  getTodo: async (id: number): Promise<Todo> => {
    const response = await api.get(`/api/todos/${id}`);
    return response.data;
  },

  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    const response = await api.post('/api/todos', data);
    return response.data;
  },

  updateTodo: async (id: number, data: UpdateTodoData): Promise<Todo> => {
    const response = await api.put(`/api/todos/${id}`, data);
    return response.data;
  },

  completeTodo: async (id: number): Promise<Todo> => {
    const response = await api.patch(`/api/todos/${id}/complete`);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/api/todos/${id}`);
  },
};

export default api;