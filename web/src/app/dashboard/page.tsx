'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { todoAPI, Todo } from '@/lib/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getTodos();
      setTodos(response.data);
    } catch (err: unknown) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      await todoAPI.createTodo(newTodo);
      setNewTodo({ title: '', description: '' });
      setIsDialogOpen(false);
      fetchTodos();
    } catch (err: unknown) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    }
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      await todoAPI.updateTodo(editingTodo.id, {
        title: editingTodo.title,
        description: editingTodo.description,
      });
      setEditingTodo(null);
      setIsDialogOpen(false);
      fetchTodos();
    } catch (err: unknown) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await todoAPI.completeTodo(id);
      fetchTodos();
    } catch (err: unknown) {
      setError('Failed to update todo');
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoAPI.deleteTodo(id);
      fetchTodos();
    } catch (err: unknown) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTodo(null)}>Add New Todo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingTodo ? editingTodo.title : newTodo.title}
                    onChange={(e) => {
                      if (editingTodo) {
                        setEditingTodo({ ...editingTodo, title: e.target.value });
                      } else {
                        setNewTodo({ ...newTodo, title: e.target.value });
                      }
                    }}
                    placeholder="Enter todo title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editingTodo ? editingTodo.description || '' : newTodo.description}
                    onChange={(e) => {
                      if (editingTodo) {
                        setEditingTodo({ ...editingTodo, description: e.target.value });
                      } else {
                        setNewTodo({ ...newTodo, description: e.target.value });
                      }
                    }}
                    placeholder="Enter todo description (optional)"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingTodo ? 'Update Todo' : 'Create Todo'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => (
            <Card key={todo.id} className={`${todo.completed ? 'opacity-75' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`text-sm mt-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        {todo.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button
                    onClick={() => handleToggleComplete(todo.id)}
                    variant={todo.completed ? 'outline' : 'default'}
                    size="sm"
                  >
                    {todo.completed ? 'Undo' : 'Complete'}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setEditingTodo(todo);
                        setIsDialogOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteTodo(todo.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No todos yet. Create your first todo!</p>
          </div>
        )}
      </div>
    </div>
  );
}