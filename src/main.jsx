import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import CaseStudyIndex from './pages/CaseStudyIndex'
import CatalogPage from './pages/CatalogPage'
import ImageDetailPage from './pages/ImageDetailPage'
import MirrorDetailPage from './pages/MirrorDetailPage'
import CustomizePage from './pages/CustomizePage'
import ManagePage from './pages/ManagePage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/prototype">
      <Routes>
        <Route path="/" element={<CaseStudyIndex />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:slug" element={<ImageDetailPage />} />
        <Route path="/mirror" element={<MirrorDetailPage />} />
        <Route path="/customize" element={<CustomizePage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
