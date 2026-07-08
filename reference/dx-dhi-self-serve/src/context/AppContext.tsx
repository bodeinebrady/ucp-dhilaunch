import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Auth states from the DHI Free vs Paid auth state scenarios doc:
 *
 * State 1: not-signed-in — No identity, no org context
 * State 2: personal — Signed into Hub, personal namespace
 * State 3a-entitled: org-entitled — Org context, has DHI entitlements (can mirror)
 * State 3a-at-limit: org-at-limit — Org context, has entitlements but exhausted
 * State 3b: org-no-entitlements — Org context, no DHI entitlements
 * State 3c: org-trial — Org context, 30-day free trial of DHI Select (full access, time-boxed)
 */
export type AuthState =
  | 'not-signed-in'
  | 'personal'
  | 'org-entitled'
  | 'org-at-limit'
  | 'org-no-entitlements'
  | 'org-trial'
  | 'org-trial-ended'
  | 'org-trial-ended-extended'
  | 'org-select-customization-limit';

interface AppContextValue {
  authState: AuthState;
  setAuthState: (s: AuthState) => void;
  daysRemaining: number;
  setDaysRemaining: (d: number) => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  selectedImage: string;
  setSelectedImage: (img: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('not-signed-in');
  const [daysRemaining, setDaysRemaining] = useState(25);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('node:20-bookworm');

  return (
    <AppContext.Provider value={{
      authState,
      setAuthState,
      daysRemaining,
      setDaysRemaining,
      panelOpen,
      setPanelOpen,
      selectedImage,
      setSelectedImage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
