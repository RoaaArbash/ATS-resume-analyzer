// src/components/Loader/Loader.jsx
const Loader = ({ message }) => {
  return (
    <div className="loader">
      <p>{message || "Loading..."}</p>
    </div>
  );
};

export default Loader; 