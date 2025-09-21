import { useEffect, useState, useMemo } from "react";

const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allLoaded, setAllLoaded] = useState(false);

  const memoizedImageUrls = useMemo(() => imageUrls, [imageUrls.join(",")]);

  useEffect(() => {
    if (memoizedImageUrls.length === 0) {
      setAllLoaded(true);
      return;
    }

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

    setLoadedImages(new Set());
    setAllLoaded(false);

    Promise.all(memoizedImageUrls.map(loadImage)).then(() => {
      setAllLoaded(true);
    });
  }, [memoizedImageUrls]);

  return { loadedImages, allLoaded };
};

export default useImagePreloader;
