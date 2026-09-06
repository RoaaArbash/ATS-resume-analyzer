import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpload } from '../hooks/useUpload';
import UploadBox from '../components/Upload/UploadBox';

const Home = () => {
  const navigate = useNavigate();
  const { file, loading, error, handleFileUpload } = useUpload();

  useEffect(() => {
    if (file && file.result) {
      navigate('/result', { state: { result: file.result } });
    }
  }, [file, navigate]);

  return (
    <div>
      <UploadBox onFileUpload={handleFileUpload} />
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {file && <p>File "{file.name}" uploaded successfully!</p>}
    </div>
  );
};

export default Home;