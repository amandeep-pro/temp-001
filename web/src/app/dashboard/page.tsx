'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { todoAPI, Todo } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  LogOut, 
  User,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchTodos();
  }, [user, router]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getTodos();
      setTodos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    setIsSubmitting(true);
    try {
      const todo = await todoAPI.createTodo(newTodo);
      setTodos([todo, ...todos]);
      setNewTodo({ title: '', description: '' });
      setIsCreateDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(id, updates);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setEditingTodo(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update todo');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(id, { completed });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete todo');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6" />
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name || user?.email}
          </h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Todo Button */}
      <div className="mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Todo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="Enter todo title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="Enter todo description (optional)"
                />
              </div>
              <Button 
                onClick={handleCreateTodo} 
                disabled={!newTodo.title.trim() || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Todo'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Todos List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-gray-500">No todos yet. Create your first todo!</p>
            </CardContent>
          </Card>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className={`${todo.completed ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleComplete(todo.id, !todo.completed)}
                    >
                      {todo.completed ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                          {todo.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTodo(todo)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Todo Dialog */}
      {editingTodo && (
        <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingTodo.description || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                />
              </div>
              <Button 
                onClick={() => handleUpdateTodo(editingTodo.id, {
                  title: editingTodo.title,
                  description: editingTodo.description
                })}
                className="w-full"
              >
                Update Todo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}