import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import IndexPage from './pages/IndexPage';
import CatalogPage from './pages/CatalogPage';
import ImageDetailPage from './pages/ImageDetailPage';
import CatalogPageV2 from './pages/CatalogPageV2';
import ImageDetailPageV2 from './pages/ImageDetailPageV2';
import PlansPage from './pages/PlansPage';
import CatalogPageV3 from './pages/CatalogPageV3';
import ImageDetailPageV3 from './pages/ImageDetailPageV3';
import PlansPageV3 from './pages/PlansPageV3';
import ImageVersionPage from './pages/ImageVersionPage';
import MyHubManagePage from './pages/MyHubManagePage';
import MyHubRepoPage from './pages/MyHubRepoPage';
import ImageDetailPageV1Free from './pages/ImageDetailPageV1Free';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/v1" element={<CatalogPage />} />
          <Route path="/v1/image/:slug" element={<ImageDetailPage />} />
          <Route path="/v1/image/nodejs-free" element={<ImageDetailPageV1Free />} />
          <Route path="/v2" element={<CatalogPageV2 />} />
          <Route path="/v2/image/:slug" element={<ImageDetailPageV2 />} />
          <Route path="/v2/plans" element={<PlansPage />} />
          <Route path="/v3" element={<CatalogPageV3 />} />
          <Route path="/v3/image/:slug" element={<ImageDetailPageV3 />} />
          <Route path="/v3/image/:slug/version/:versionId" element={<ImageVersionPage />} />
          <Route path="/v3/plans" element={<PlansPageV3 />} />
          <Route path="/v3/manage" element={<MyHubManagePage />} />
          <Route path="/v3/manage/:repoSlug" element={<MyHubRepoPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
