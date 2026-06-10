import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WebGLExperience } from '@/components/WebGLExperience';

function HomePage() {
  return <WebGLExperience />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
