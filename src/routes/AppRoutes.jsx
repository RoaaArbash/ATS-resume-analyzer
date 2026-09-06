import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Analyze from '../pages/Analyze';
import Result from '../pages/Result';
import OptimizedCV from '../pages/OptimizedCV'; 

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/result" element={<Result />} />
          <Route path="/optimized" element={<OptimizedCV />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;