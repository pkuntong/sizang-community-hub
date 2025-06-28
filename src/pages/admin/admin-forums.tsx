import React from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Textarea } from "@heroui/react";
import { useAuth } from '../../components/auth/auth-context';
import { ForumCategory } from '../../types/models';

export const AdminForums: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = React.useState<ForumCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingCategory, setEditingCategory] = React.useState<ForumCategory | null>(null);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/forums/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      order: categories.length + 1,
    };

    try {
      const response = await fetch('/api/admin/forums/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchCategories();
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
    };

    try {
      const response = await fetch(`/api/admin/forums/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchCategories();
        setEditingCategory(null);
      }
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/forums/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Forum Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                />
                <Textarea
                  label="Description"
                  name="description"
                  defaultValue={editingCategory?.description}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" color="primary">
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                  {editingCategory && (
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <Table aria-label="Categories table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>ORDER</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onClick={() => setEditingCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};