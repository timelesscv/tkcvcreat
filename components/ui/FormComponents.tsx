import React from 'react';
import { Camera, User, FileText, ArrowLeft } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormInput: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</label>
    <input
      className={`w-full p-3 bg-primary border-2 border-surfaceElevated rounded-xl text-white focus:outline-none focus:border-current transition-all duration-300 placeholder:text-slate-600 ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const FormSelect: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</label>
    <select
      className={`w-full p-3 bg-primary border-2 border-surfaceElevated rounded-xl text-white focus:outline-none focus:border-current transition-all duration-300 ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FormCheckbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, className }) => (
  <div className={`flex items-center gap-3 p-3 bg-primary border-2 border-surfaceElevated rounded-xl cursor-pointer hover:border-current transition-all ${className}`}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 accent-current cursor-pointer"
    />
    <label htmlFor={id} className="cursor-pointer font-medium select-none">{label}</label>
  </div>
);

interface PhotoUploadProps {
  label: string;
  type: 'face' | 'full' | 'pass';
  preview: string | null;
  onUpload: (file: File) => void;
  colorClass: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ label, type, preview, onUpload, colorClass }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const Icon = type === 'face' ? Camera : type === 'full' ? User : FileText;

  return (
    <div className="flex flex-col items-center gap-4">
      <label className={`w-full flex flex-col items-center justify-center p-6 bg-primary border-2 border-dashed border-surfaceElevated rounded-xl cursor-pointer hover:bg-surfaceElevated transition-all group hover:border-${colorClass}`}>
        <Icon className={`w-10 h-10 mb-3 text-slate-400 group-hover:text-${colorClass} transition-colors`} />
        <span className="font-semibold text-center">{label}</span>
        <input type="file" accept="image/*" hidden onChange={handleChange} />
        <span className="text-xs text-slate-500 mt-2">Click to upload</span>
      </label>
      {preview && (
        <img
          src={preview}
          alt={label}
          className={`w-full h-40 object-cover rounded-xl border-2 border-surfaceElevated`}
        />
      )}
    </div>
  );
};

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  accentColor: string; // e.g. 'border-accentKuwait'
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, icon, accentColor }) => (
  <div className={`bg-secondary p-6 rounded-2xl border-l-4 ${accentColor} mb-6 shadow-lg`}>
    <div className="flex items-center gap-3 mb-6 text-xl font-semibold text-white">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);

export const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed top-5 left-5 z-50 flex items-center gap-2 px-6 py-3 bg-surface border-2 border-surfaceElevated rounded-xl font-semibold hover:bg-surfaceElevated hover:-translate-x-1 transition-all shadow-xl"
  >
    <ArrowLeft className="w-5 h-5" />
    Back
  </button>
);

export const Header: React.FC<{ title: string; subtitle: string; flag: string }> = ({ title, subtitle, flag }) => (
  <div className="text-center mb-10 pt-20">
    <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
      <span>{flag}</span>
      <span>{title}</span>
    </div>
    <div className="text-slate-400 text-xl">{subtitle}</div>
  </div>
);
