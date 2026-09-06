import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpload } from "../hooks/useUpload";
import Loader from "../components/Loader/Loader";

const Analyze = () => {
  const { state } = useLocation();

  const {
    file,
    loading,
    handleFileUpload,
  } = useUpload();

  const navigate = useNavigate();

  useEffect(() => {
    if (state?.file && !file) {
      handleFileUpload(state.file);
    }

    if (!state?.file) {
      navigate("/", { replace: true });
    }
  }, [state, file, handleFileUpload, navigate]);

  useEffect(() => {
    if (file?.result) {
      navigate("/result", {
        state: {
          result: file.result,
        },
        replace: true,
      });
    }
  }, [file, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      {loading ? (
        <Loader message="Extracting and Analyzing your Resume..." />
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">
            Processing...
          </h2>

          <p>
            Please wait while we analyze your resume.
          </p>
        </div>
      )}
    </div>
  );
};

export default Analyze;