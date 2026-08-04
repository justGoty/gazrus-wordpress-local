"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/catalog/schema";

type ProductGalleryProps = {
  media: Product["media"];
};

export function ProductGallery({ media }: ProductGalleryProps) {
  const images = media.filter((item) => item.type === "image");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        {activeImage ? (
          <div
            key={activeImage.url}
            className="product-gallery-image"
            role="img"
            aria-label={activeImage.alt}
            style={{ backgroundImage: `url(${JSON.stringify(activeImage.url)})` }}
          />
        ) : (
          <div className="product-detail-placeholder" aria-label="Изображение товара отсутствует">
            <ImageIcon aria-hidden="true" size={42} />
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="product-gallery-thumbnails" role="group" aria-label="Фотографии товара">
          {images.map((image, index) => (
            <button
              type="button"
              data-active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Показать изображение: ${image.alt}`}
              aria-pressed={activeIndex === index}
              key={image.url}
            >
              <span
                role="img"
                aria-label={image.alt}
                style={{ backgroundImage: `url(${JSON.stringify(image.url)})` }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
