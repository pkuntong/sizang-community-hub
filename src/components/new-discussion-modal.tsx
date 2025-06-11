import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

interface NewDiscussionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    content: string;
    category: string;
  }) => void;
}

export const NewDiscussionModal: React.FC<NewDiscussionModalProps> = ({ 
  isOpen, 
  onOpenChange,
  onSubmit
}) => {
  // Add translation hook
  const { t } = useTranslation();
  
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState("");
  // Add missing state
  const [contentLanguage, setContentLanguage] = React.useState("en");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setContent("");
      setCategory("");
    }
  }, [isOpen]);
  
  const categories = [
    { key: "culture", label: t('forums.categories.culture') },
    { key: "religion", label: t('forums.categories.religion') },
    { key: "youth", label: t('forums.categories.youth') },
    { key: "language", label: t('forums.categories.language') },
    { key: "events", label: t('forums.categories.events') },
    { key: "migration", label: t('forums.categories.migration') },
    { key: "other", label: "Other" }
  ];
  
  const languages = [
    { key: "en", label: "English" },
    { key: "sz", label: "Sizang" },
    { key: "my", label: "Burmese" }
  ];
  
  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) return;
    
    setIsSubmitting(true);
    
    try {
      onSubmit({
        title,
        content,
        category
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
    } catch (error) {
      console.error("Error creating discussion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t('forums.newTopic')}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label={t('resources.resourceTitle')}
                  placeholder={t('resources.resourceTitlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="bordered"
                  isRequired
                />
                
                <div className="flex gap-4">
                  <Select
                    label={t('resources.category')}
                    placeholder={t('resources.selectCategory')}
                    selectedKeys={category ? [category] : []}
                    onChange={(e) => setCategory(e.target.value)}
                    variant="bordered"
                    isRequired
                    className="flex-1"
                  >
                    {categories.map((cat) => (
                      <SelectItem key={cat.key} value={cat.key}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label={t('languages.select')}
                    placeholder={t('languages.select')}
                    selectedKeys={[contentLanguage]}
                    onChange={(e) => setContentLanguage(e.target.value)}
                    variant="bordered"
                    className="flex-1"
                  >
                    {languages.map((lang) => (
                      <SelectItem key={lang.key} value={lang.key}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <Textarea
                  label={t('resources.description')}
                  placeholder={t('resources.descriptionPlaceholder')}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="bordered"
                  minRows={6}
                  isRequired
                />
                
                <div className="border border-dashed border-divider rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                  <Icon icon="lucide:image" className="text-2xl text-foreground-400" />
                  <p className="text-sm text-foreground-500">{t('resources.dragDrop')}</p>
                  <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    startContent={<Icon icon="lucide:upload" />}
                  >
                    {t('resources.selectFile')}
                  </Button>
                  <p className="text-xs text-foreground-400">Optional: Add an image to your discussion</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                {t('resources.cancel')}
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!title.trim() || !content.trim() || !category}
              >
                {t('forums.newTopic')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};