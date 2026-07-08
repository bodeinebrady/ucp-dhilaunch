import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import IndexPage from './pages/IndexPage'
import BulkCustomizations from './pages/BulkCustomizations'
import BulkCustomizationsV2 from './pages/BulkCustomizationsV2'
import RationaleV2 from './pages/RationaleV2'

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" forcedTheme="light">
      <HashRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/v1" element={<BulkCustomizations />} />
          <Route path="/v2" element={<BulkCustomizationsV2 />} />
          <Route path="/rationale" element={<RationaleV2 />} />
        </Routes>
      </HashRouter>
      <Toaster position="bottom-center" />
    </ThemeProvider>
  )
}
