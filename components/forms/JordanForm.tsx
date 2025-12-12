
import React, { useState, useEffect } from 'react';
import { JordanFormData } from '../../types';
import { FormInput, FormSelect, FormCheckbox, FormSection, PhotoUpload, Header, BackButton } from '../ui/FormComponents';
import { User, FileText, Languages, Briefcase, Hammer, Image as ImageIcon, Building2 } from 'lucide-react';
import { generateCountryPDF } from '../../utils/pdfGenerator';

interface Props {
  onBack: () => void;
}

const JordanForm: React.FC<Props> = ({ onBack }) => {
  const [formData, setFormData] = useState<JordanFormData>({
    office: 'ewan',
    fullName: '', refNo: '', religion: 'MUSLIM', dob: '', age: '', pob: 'ADDIS ABABA', maritalStatus: 'SINGLE', children: '0',
    weight: '55 KG', height: '1.62 M', education: 'HIGH SCHOOL',
    passportNumber: '', issueDate: '', placeOfIssue: 'ADDIS ABABA', expiryDate: '',
    hasExperience: false, expCountry: '', expPeriod: '', expPosition: 'HOUSEMAID',
    expCountry2: '', expPeriod2: '', expPosition2: 'HOUSEMAID',
    englishLevel: '', arabicLevel: '',
    skills: { babySitting: true, cleaning: true, cooking: false },
    photos: { face: null, full: null, passport: null }
  });

  useEffect(() => {
    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  useEffect(() => {
     // Office specific logic logic
     if (formData.office === 'option') {
        setFormData(prev => ({ ...prev, skills: { ...prev.skills, cleaning: false } }));
     } else {
        setFormData(prev => ({ ...prev, skills: { ...prev.skills, cleaning: true } }));
     }
  }, [formData.office]);

  // Auto toggle cooking based on experience
  useEffect(() => {
    if (formData.hasExperience) {
       setFormData(prev => ({ ...prev, skills: { ...prev.skills, cooking: true } }));
    } else {
       setFormData(prev => ({ ...prev, skills: { ...prev.skills, cooking: false } }));
    }
  }, [formData.hasExperience]);

  const handlePhotoUpload = (type: 'face' | 'full' | 'passport', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        photos: { ...prev.photos, [type]: e.target?.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const generatePDF = () => {
    generateCountryPDF(formData, 'jordan', formData.office);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in">
      <BackButton onClick={onBack} />
      <Header title="Jordan CV Generator" subtitle="EWAN • OPTION • INJAZ Offices" flag="🇯🇴" />

      <div className="text-accentJordan">
        <FormSection title="Select Office" icon={<Building2 />} accentColor="border-accentJordan">
           <div className="flex gap-4 justify-center">
              {['ewan', 'option', 'injaz'].map((office) => (
                 <label key={office} className={`flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.office === office ? 'bg-accentJordan text-black border-accentJordan' : 'border-surfaceElevated hover:border-accentJordan'}`}>
                    <input type="radio" name="office" className="hidden" checked={formData.office === office} onChange={() => setFormData({...formData, office: office as any})} />
                    <span className="font-bold uppercase">{office}</span>
                 </label>
              ))}
           </div>
        </FormSection>

        <FormSection title="Personal Details" icon={<User />} accentColor="border-accentJordan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })} placeholder="JEMILA SHAFI ABAGISA" />
            <FormInput label="Ref-No" value={formData.refNo} onChange={e => setFormData({ ...formData, refNo: e.target.value.toUpperCase() })} placeholder="JO-1028" />
            <FormSelect label="Religion" options={['MUSLIM', 'CHRISTIAN']} value={formData.religion} onChange={e => setFormData({ ...formData, religion: e.target.value })} />
            <FormInput type="date" label="Date of Birth" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
            <FormInput label="Age" value={formData.age} readOnly className="opacity-70" />
            <FormInput label="Place of Birth" value={formData.pob} onChange={e => setFormData({ ...formData, pob: e.target.value.toUpperCase() })} />
            <FormInput label="Children" value={formData.children} onChange={e => setFormData({ ...formData, children: e.target.value })} />
            <FormInput label="Weight" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
            <FormInput label="Height" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
            <FormSelect label="Marital Status" options={['SINGLE', 'MARRIED', 'DIVORCED']} value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })} />
            {formData.office === 'injaz' && (
               <FormInput label="Educational Qualification" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value.toUpperCase() })} />
            )}
          </div>
        </FormSection>

        <FormSection title="Passport Details" icon={<FileText />} accentColor="border-accentJordan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Passport Number" value={formData.passportNumber} onChange={e => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })} />
            <FormInput type="date" label="Issue Date" value={formData.issueDate} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} />
            <FormInput label="Place of Issue" value={formData.placeOfIssue} onChange={e => setFormData({ ...formData, placeOfIssue: e.target.value.toUpperCase() })} />
            <FormInput type="date" label="Expiry Date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
          </div>
        </FormSection>

        <FormSection title="Language Proficiency" icon={<Languages />} accentColor="border-accentJordan">
           <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-surfaceElevated pb-4">
                 <div className="w-32 font-bold text-white">ENGLISH</div>
                 <div className="flex gap-6">
                    {['POOR', 'FAIR', 'FLUENT'].map(level => (
                       <label key={`eng-${level}`} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="jo-english" className="accent-accentJordan w-5 h-5" checked={formData.englishLevel === level} onChange={() => setFormData({...formData, englishLevel: level})} />
                          <span className="text-slate-300 text-sm font-medium">{level}</span>
                       </label>
                    ))}
                 </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                 <div className="w-32 font-bold text-white">ARABIC</div>
                 <div className="flex gap-6">
                    {['POOR', 'FAIR', 'FLUENT'].map(level => (
                       <label key={`ara-${level}`} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="jo-arabic" className="accent-accentJordan w-5 h-5" checked={formData.arabicLevel === level} onChange={() => setFormData({...formData, arabicLevel: level})} />
                          <span className="text-slate-300 text-sm font-medium">{level}</span>
                       </label>
                    ))}
                 </div>
              </div>
           </div>
        </FormSection>

        <FormSection title="Previous Employment" icon={<Briefcase />} accentColor="border-accentJordan">
           <FormCheckbox 
              id="jo-hasExp" label="HAS PREVIOUS EXPERIENCE" checked={formData.hasExperience} onChange={e => setFormData({...formData, hasExperience: e.target.checked})} className="mb-4 hover:border-accentJordan"
           />
           {formData.hasExperience && (
              <div className="space-y-4 animate-fade-in-down">
                 <div className="p-3 border border-surfaceElevated rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Record 1</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <FormInput label="Country" value={formData.expCountry} onChange={e => setFormData({...formData, expCountry: e.target.value.toUpperCase()})} placeholder="JORDAN" />
                       <FormInput label="Period (Years)" value={formData.expPeriod} onChange={e => setFormData({...formData, expPeriod: e.target.value})} />
                       <FormInput label="Position" value={formData.expPosition} readOnly />
                    </div>
                 </div>
                 <div className="p-3 border border-surfaceElevated rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Record 2 (Optional)</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <FormInput label="Country" value={formData.expCountry2} onChange={e => setFormData({...formData, expCountry2: e.target.value.toUpperCase()})} placeholder="JORDAN" />
                       <FormInput label="Period (Years)" value={formData.expPeriod2} onChange={e => setFormData({...formData, expPeriod2: e.target.value})} />
                       <FormInput label="Position" value={formData.expPosition2} onChange={e => setFormData({...formData, expPosition2: e.target.value.toUpperCase()})} />
                    </div>
                 </div>
              </div>
           )}
        </FormSection>

        <FormSection title="Work Experience" icon={<Hammer />} accentColor="border-accentJordan">
           <div className="flex flex-wrap gap-3">
              <FormCheckbox id="jo-baby" label="Baby Sitting" checked={formData.skills.babySitting} onChange={e => setFormData({...formData, skills: {...formData.skills, babySitting: e.target.checked}})} className="flex-1 hover:border-accentJordan" />
              {formData.office !== 'option' && (
                 <FormCheckbox id="jo-clean" label="Cleaning" checked={formData.skills.cleaning} onChange={e => setFormData({...formData, skills: {...formData.skills, cleaning: e.target.checked}})} className="flex-1 hover:border-accentJordan" />
              )}
              {formData.office === 'injaz' && (
                 <FormCheckbox id="jo-cook" label="Cooking" checked={formData.skills.cooking} onChange={e => setFormData({...formData, skills: {...formData.skills, cooking: e.target.checked}})} className="flex-1 hover:border-accentJordan" />
              )}
           </div>
        </FormSection>

        <FormSection title="Photos" icon={<ImageIcon />} accentColor="border-accentJordan">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PhotoUpload label="FACE PHOTO" type="face" preview={formData.photos.face} onUpload={(f) => handlePhotoUpload('face', f)} colorClass="accentJordan" />
              <PhotoUpload label="FULL BODY" type="full" preview={formData.photos.full} onUpload={(f) => handlePhotoUpload('full', f)} colorClass="accentJordan" />
              <PhotoUpload label="PASSPORT" type="pass" preview={formData.photos.passport} onUpload={(f) => handlePhotoUpload('passport', f)} colorClass="accentJordan" />
           </div>
        </FormSection>

        <div className="flex justify-center mt-10">
           <button onClick={generatePDF} className="px-10 py-4 bg-gradient-to-r from-accentJordan to-green-600 rounded-xl font-bold text-lg shadow-lg shadow-accentJordan/20 hover:shadow-accentJordan/40 transform hover:-translate-y-1 transition-all text-black">
              📄 Generate {formData.office.toUpperCase()} PDF
           </button>
        </div>
      </div>
    </div>
  );
};

export default JordanForm;
