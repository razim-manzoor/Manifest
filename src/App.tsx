import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { JobTracker } from './pages/JobTracker';
import { Networking } from './pages/Networking';
import { Profile } from './pages/Profile';
import { Oracle } from './pages/Oracle';
import { ClipperImport } from './pages/ClipperImport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tracker" element={<JobTracker />} />
          <Route path="networking" element={<Networking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="oracle" element={<Oracle />} />
          <Route path="clipper" element={<ClipperImport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
