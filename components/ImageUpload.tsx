'use client';

import { ChangeEvent, DragEvent, useRef, useState } from 'react';

interface ImageUploadProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

export default function ImageUpload({ image, onImageChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const loadFile = (file?: File) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => onImageChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    loadFile(event.dataTransfer.files[0]);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => loadFile(event.target.files?.[0]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`w-full rounded-2xl border border-dashed p-4 text-left transition ${dragging ? 'border-indigo-300 bg-indigo-500/20' : 'border-slate-600 bg-slate-900/70 hover:border-slate-400'}`}
      >
        <p className="text-sm font-semibold text-white">Upload product image</p>
        <p className="mt-1 text-xs text-slate-400">Drag JPG, PNG, or WEBP here, or click to browse.</p>
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onChange} />
      {image && (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
          <img src={image} alt="Uploaded preview" className="h-14 w-14 rounded-xl object-cover" />
          <button type="button" onClick={() => onImageChange(null)} className="text-xs font-medium text-rose-300 hover:text-rose-200">
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
