'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResizedImage(null);
    setIsLoading(true);

    if (!file || !width || !height) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const resizedImageData = await resizeImage(file, parseInt(width), parseInt(height));
      setResizedImage(resizedImageData);
    } catch (err) {
      setError('An error occurred while resizing the image');
      console.error('Error in handleSubmit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resizedImage) {
      const link = document.createElement('a');
      link.href = resizedImage;
      link.download = 'resized-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
          />
        </div>
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
            Max Width
          </label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Max Height
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Resize Image'}
        </Button>
      </form>
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {resizedImage && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Resized Image:</h2>
          <img src={resizedImage} alt="Resized" className="max-w-full h-auto mb-4" />
          <Button onClick={handleDownload} className="w-full">
            Download Resized Image
          </Button>
        </div>
      )}
    </div>
  )
}

async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate the new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Use better quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.95)); // Increased quality to 0.95
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = URL.createObjectURL(file);
  });
}

