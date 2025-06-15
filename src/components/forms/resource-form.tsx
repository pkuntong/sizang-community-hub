import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Select, SelectItem, Chip } from "@heroui/react";
import { useAuth } from '../../hooks/useAuth';
import { Icon } from "@iconify/react";

interface ResourceFormData {
  title: string;
  description: string;
  type: 'link' | 'file' | 'article';
  url?: string;
  file?: File;
  language: string;
  category: string;
  tags: string[];
}

interface ResourceFormProps {
  onSubmit: (data: ResourceFormData) => Promise<void>;
  initialData?: Partial<ResourceFormData>;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  onSubmit,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<ResourceFormData>({
    defaultValues: {
      ...initialData,
      tags: initialData?.tags || []
    }
  });
  const { user } = useAuth();
  const [tagInput, setTagInput] = useState('');
  const selectedType = watch('type');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'my', name: 'Burmese' },
    { code: 'sz', name: 'Sizang' }
  ];

  const categories = [
    'Language Learning',
    'Cultural Heritage',
    'History',
    'News',
    'Education',
    'Other'
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !watch('tags').includes(tagInput.trim())) {
      setValue('tags', [...watch('tags'), tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watch('tags').filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="Title"
          placeholder="Enter resource title"
          {...register('title', { required: 'Title is required' })}
          errorMessage={errors.title?.message}
        />
      </div>

      <div>
        <Textarea
          label="Description"
          placeholder="Describe the resource..."
          minRows={3}
          {...register('description', { required: 'Description is required' })}
          errorMessage={errors.description?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Type"
          placeholder="Select resource type"
          {...register('type', { required: 'Type is required' })}
          errorMessage={errors.type?.message}
        >
          <SelectItem value="link">Link</SelectItem>
          <SelectItem value="file">File</SelectItem>
          <SelectItem value="article">Article</SelectItem>
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

      {selectedType === 'link' && (
        <div>
          <Input
            label="URL"
            placeholder="Enter resource URL"
            type="url"
            {...register('url', { 
              required: 'URL is required',
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Please enter a valid URL'
              }
            })}
            errorMessage={errors.url?.message}
          />
        </div>
      )}

      {selectedType === 'file' && (
        <div>
          <Input
            label="File"
            type="file"
            {...register('file', { required: 'File is required' })}
            errorMessage={errors.file?.message}
          />
        </div>
      )}

      <div>
        <Select
          label="Category"
          placeholder="Select category"
          {...register('category', { required: 'Category is required' })}
          errorMessage={errors.category?.message}
        >
          {categories.map(category => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <div className="flex gap-2 mb-2">
          <Input
            label="Tags"
            placeholder="Add tags..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button
            type="button"
            color="primary"
            variant="flat"
            onClick={handleAddTag}
            className="mt-8"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {watch('tags').map(tag => (
            <Chip
              key={tag}
              onClose={() => handleRemoveTag(tag)}
              variant="flat"
            >
              {tag}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          isDisabled={!user}
        >
          {initialData ? 'Update Resource' : 'Create Resource'}
        </Button>
      </div>
    </form>
  );
}; 