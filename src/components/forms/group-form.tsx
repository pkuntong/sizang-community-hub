import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useAuth } from '../../hooks/useAuth';

interface GroupFormData {
  name: string;
  description: string;
  privacy: 'public' | 'private' | 'secret';
  rules?: string;
}

interface GroupFormProps {
  onSubmit: (data: GroupFormData) => Promise<void>;
  initialData?: Partial<GroupFormData>;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  onSubmit,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GroupFormData>({
    defaultValues: initialData
  });
  const { user } = useAuth();

  const privacyOptions = [
    { value: 'public', label: 'Public - Anyone can view and join' },
    { value: 'private', label: 'Private - Anyone can view, but must request to join' },
    { value: 'secret', label: 'Secret - Only members can view and join' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="Group Name"
          placeholder="Enter group name"
          {...register('name', { 
            required: 'Name is required',
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters'
            }
          })}
          errorMessage={errors.name?.message}
        />
      </div>

      <div>
        <Textarea
          label="Description"
          placeholder="Describe your group..."
          minRows={3}
          {...register('description', { 
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters'
            }
          })}
          errorMessage={errors.description?.message}
        />
      </div>

      <div>
        <Select
          label="Privacy Setting"
          placeholder="Select privacy level"
          {...register('privacy', { required: 'Privacy setting is required' })}
          errorMessage={errors.privacy?.message}
        >
          {privacyOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Textarea
          label="Group Rules (Optional)"
          placeholder="Set rules for your group..."
          minRows={3}
          {...register('rules')}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          isDisabled={!user}
        >
          {initialData ? 'Update Group' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
}; 