import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useAuth } from '../../hooks/useAuth';

interface ThreadFormData {
  title: string;
  content: string;
  categoryId: string;
  language: string;
}

interface ThreadFormProps {
  categories: Array<{ id: string; name: string }>;
  onSubmit: (data: ThreadFormData) => Promise<void>;
  initialData?: Partial<ThreadFormData>;
}

export const ThreadForm: React.FC<ThreadFormProps> = ({
  categories,
  onSubmit,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ThreadFormData>({
    defaultValues: initialData
  });
  const { user } = useAuth();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'my', name: 'Burmese' },
    { code: 'sz', name: 'Sizang' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="Title"
          placeholder="Enter thread title"
          {...register('title', { required: 'Title is required' })}
          errorMessage={errors.title?.message}
        />
      </div>

      <div>
        <Textarea
          label="Content"
          placeholder="Write your post content here..."
          minRows={5}
          {...register('content', { required: 'Content is required' })}
          errorMessage={errors.content?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          placeholder="Select a category"
          {...register('categoryId', { required: 'Category is required' })}
          errorMessage={errors.categoryId?.message}
        >
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Language"
          placeholder="Select language"
          {...register('language', { required: 'Language is required' })}
          errorMessage={errors.language?.message}
        >
          {languages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          isDisabled={!user}
        >
          {initialData ? 'Update Thread' : 'Create Thread'}
        </Button>
      </div>
    </form>
  );
}; 