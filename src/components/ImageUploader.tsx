import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  apiKey: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImageUrl,
  apiKey
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError('');

    try {
      // Validar tamanho do arquivo (máximo 32MB para ImgBB)
      if (file.size > 32 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo permitido: 32MB');
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
      }

      // Converter arquivo para base64
      const base64 = await fileToBase64(file);
      
      // Fazer upload para ImgBB
      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('image', base64.split(',')[1]); // Remove o prefixo data:image/...;base64,
      formData.append('name', file.name.split('.')[0]); // Nome sem extensão

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.data.url;
        setPreviewUrl(imageUrl);
        onImageUpload(imageUrl);
      } else {
        throw new Error(result.error?.message || 'Erro ao fazer upload da imagem');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadError(error instanceof Error ? error.message : 'Erro desconhecido no upload');
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        <Upload className="w-4 h-4 inline mr-1" />
        Foto da Denúncia (Opcional)
      </label>

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview da imagem"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="space-y-2">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <div className="text-sm text-gray-600">
              {isUploading ? (
                <p>Fazendo upload...</p>
              ) : (
                <>
                  <p>Clique para selecionar ou arraste uma imagem aqui</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF até 32MB</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {uploadError}
        </div>
      )}

      <p className="text-xs text-gray-500">
        A imagem será enviada para um serviço de hospedagem gratuito e o link será incluído na denúncia.
      </p>
    </div>
  );
};

export default ImageUploader;

