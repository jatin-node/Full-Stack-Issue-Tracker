import React from "react";
import AnimationWrapper from "./AnimationWrapper";

const ImageModal = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <AnimationWrapper transition={ {"duration": .1} } >
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <img src={imageUrl} alt="Full-size view" style={styles.image} />
          <button onClick={onClose} style={styles.closeButton}>
            ×
          </button>
        </div>
      </div>
    </AnimationWrapper>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
  },
  image: {
    maxWidth: "80vw",
    maxHeight: "80vh",
    borderRadius: "8px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "25px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  },
};

export default ImageModal;
