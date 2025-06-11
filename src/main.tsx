import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './components/auth/auth-context.tsx'
import { DiscussionProvider } from './context/discussion-context.tsx'
import { GroupProvider } from './context/group-context.tsx'
import { ResourceProvider } from './context/resource-context.tsx'
import { CategoryProvider } from './context/category-context.tsx'
import { LanguageProvider } from './context/language-context.tsx'
import { NotificationProvider } from './context/notification-context.tsx'
// Import i18n configuration
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <AuthProvider>
        <CategoryProvider>
          <LanguageProvider>
            <NotificationProvider>
              <DiscussionProvider>
                <GroupProvider>
                  <ResourceProvider>
                    <App />
                  </ResourceProvider>
                </GroupProvider>
              </DiscussionProvider>
            </NotificationProvider>
          </LanguageProvider>
        </CategoryProvider>
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>,
)