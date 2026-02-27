import "./GalleryError.css";

const GalleryError = ({
  title = "Folder Dokumentasi tidak ditemukan",
  buttonText = "Kembali",
  onBack,
}) => {
  return (
    <div className="gallery-error-screen">
      <div className="gallery-error-card">
        <h2 className="gallery-error-title">{title}</h2>
        <button className="gallery-error-button" onClick={onBack}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default GalleryError;
