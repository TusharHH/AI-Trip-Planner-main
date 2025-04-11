import { useState } from 'react';

const ImageWithFallback = ({ src, fallback, alt, className, ...props }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      {imageError || !src ? (
        <img src={fallback} alt={alt} className={className} {...props} />
      ) : (
        <img
          src={src}
          alt={alt}
          className={className}
          onError={handleImageError}
          {...props}
        />
      )}
    </>
  );
};

export default ImageWithFallback;