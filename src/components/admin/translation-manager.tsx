import React from "react";
import { Card, CardBody, CardHeader, Button, Input, Textarea, Tabs, Tab, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

// This component would be used by community moderators to help manage translations
export const TranslationManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");
  const [selectedCategory, setSelectedCategory] = React.useState("common");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [translations, setTranslations] = React.useState<Record<string, any>>({});
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // In a real app, this would load translations from the backend
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call to get translations
    setTimeout(() => {
      // Get translations from i18next
      const resources = i18n.getResourceBundle(selectedLanguage, 'translation');
      setTranslations(resources || {});
      setIsLoading(false);
    }, 500);
  }, [selectedLanguage, i18n]);

  const handleSaveTranslation = (key: string) => {
    // In a real app, this would send the updated translation to the backend
    console.log(`Saving translation for ${key}: ${editValue}`);
    
    // Update local state
    const keyParts = key.split('.');
    const newTranslations = { ...translations };
    
    let current = newTranslations;
    for (let i = 0; i < keyParts.length - 1; i++) {
      current = current[keyParts[i]];
    }
    
    current[keyParts[keyParts.length - 1]] = editValue;
    
    setTranslations(newTranslations);
    setEditingKey(null);
    setEditValue("");
  };

  const handleEditTranslation = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const getTranslationItems = (obj: Record<string, any>, prefix = '') => {
    const items: { key: string; value: string }[] = [];
    
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        items.push(...getTranslationItems(value, fullKey));
      } else {
        items.push({ key: fullKey, value: String(value) });
      }
    });
    
    return items;
  };

  const filteredTranslations = React.useMemo(() => {
    const items = getTranslationItems(translations);
    
    return items.filter(item => 
      (selectedCategory === "all" || item.key.startsWith(selectedCategory)) &&
      (!searchQuery || 
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.value.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [translations, selectedCategory, searchQuery]);

  const categories = [
    { key: "all", label: "All" },
    { key: "app", label: "App" },
    { key: "nav", label: "Navigation" },
    { key: "home", label: "Home" },
    { key: "forums", label: "Forums" },
    { key: "groups", label: "Groups" },
    { key: "resources", label: "Resources" },
    { key: "footer", label: "Footer" },
    { key: "common", label: "Common" }
  ];

  return (
    <Card className="border border-divider/40 shadow-md">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Translation Manager</h1>
          <div className="flex gap-2">
            <Button 
              color="primary" 
              variant="flat"
              startContent={<Icon icon="lucide:download" />}
            >
              Export
            </Button>
            <Button 
              color="primary"
              startContent={<Icon icon="lucide:upload" />}
            >
              Import
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Tabs 
            selectedKey={selectedLanguage} 
            onSelectionChange={setSelectedLanguage as any}
            aria-label="Select language"
            color="primary"
            variant="underlined"
          >
            <Tab key="en" title="English" />
            <Tab key="sz" title="Sizang" />
            <Tab key="my" title="Burmese" />
          </Tabs>
          
          <div className="flex-grow">
            <Input
              placeholder="Search translations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Chip 
              key={category.key}
              color={selectedCategory === category.key ? "primary" : "default"}
              variant={selectedCategory === category.key ? "solid" : "flat"}
              onClick={() => setSelectedCategory(category.key)}
              className="cursor-pointer"
            >
              {category.label}
            </Chip>
          ))}
        </div>
      </CardHeader>
      
      <CardBody>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner color="primary" size="lg" />
          </div>
        ) : filteredTranslations.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="lucide:file-x" className="text-foreground-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No translations found</h3>
            <p className="text-foreground-500">Try a different search term or category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTranslations.map(({ key, value }) => (
              <div key={key} className="border border-divider/40 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-sm bg-content2 px-2 py-1 rounded-md">
                    {key}
                  </div>
                  {editingKey !== key ? (
                    <Button 
                      size="sm" 
                      variant="light" 
                      color="primary"
                      onPress={() => handleEditTranslation(key, value)}
                      startContent={<Icon icon="lucide:edit" size={16} />}
                    >
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="light" 
                        color="danger"
                        onPress={() => setEditingKey(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        color="primary"
                        onPress={() => handleSaveTranslation(key)}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
                
                {editingKey === key ? (
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full"
                    minRows={2}
                    autoFocus
                  />
                ) : (
                  <p className="text-foreground-600">{value}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
