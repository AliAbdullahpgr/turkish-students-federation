import ImagePicker from "./ImagePicker";

interface ImageUploadFieldProps {
  value: string | null;
  previewUrl: string | null;
  onChange: (mediaId: string, secureUrl: string) => void;
  onClear: () => void;
  label?: string;
}

export default function ImageUploadField({ value: _value, previewUrl, onChange, onClear, label }: ImageUploadFieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {label}
        </label>
      )}
      <ImagePicker
        value={_value}
        previewUrl={previewUrl}
        onChange={onChange}
        onClear={onClear}
      />
    </div>
  );
}
