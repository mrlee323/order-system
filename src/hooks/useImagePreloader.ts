import { useEffect, useState } from "react";

const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    const loadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, url]));
          resolve();
        };
        img.onerror = () => resolve();
        img.src = url;
      });
    };

    Promise.all(imageUrls.map(loadImage)).then(() => {
      setAllLoaded(true);
    });
  }, [imageUrls]);

  return { loadedImages, allLoaded };
};

export default useImagePreloader;
