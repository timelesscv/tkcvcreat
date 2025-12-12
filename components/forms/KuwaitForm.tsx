
import React, { useState, useEffect } from 'react';
import { KuwaitFormData } from '../../types';
import { FormInput, FormSelect, FormCheckbox, FormSection, PhotoUpload, Header, BackButton } from '../ui/FormComponents';
import { User, FileText, Languages, Briefcase, Hammer, Ruler, Phone, Image as ImageIcon, Calendar } from 'lucide-react';
import { generateCountryPDF } from '../../utils/pdfGenerator';

interface Props {
  onBack: () => void;
}

const KuwaitForm: React.FC<Props> = ({ onBack }) => {
  const [formData, setFormData] = useState<KuwaitFormData>({
    fullName: '', refNo: '', salary: '110 KD', printDate: '', religion: 'MUSLIM', dob: '', age: '', pob: '', maritalStatus: 'SINGLE', children: '0',
    passportNumber: '', issueDate: '', placeOfIssue: 'ADDIS ABABA', expiryDate: '',
    hasExperience: false, expCountry: '', expPeriod: '', expPosition: 'HOUSEMAID',
    expCountry2: '', expPeriod2: '', expPosition2: 'HOUSEMAID',
    englishLevel: '', arabicLevel: '',
    height: '', weight: '', contactPerson: '', contactPhone: '',
    skills: { cooking: false, babySitting: true, cleaning: true, washing: true },
    photos: { face: null, full: null, passport: null }
  });

  // Auto set print date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, printDate: today }));
  }, []);

  // Auto calculate age
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

  // Auto fill contact person
  useEffect(() => {
    const parts = formData.fullName.trim().split(/\s+/);
    if (parts.length > 1) {
      setFormData(prev => ({ ...prev, contactPerson: parts.slice(1).join(' ') }));
    }
  }, [formData.fullName]);

  // Auto toggle cooking & salary based on experience
  useEffect(() => {
    if (formData.hasExperience) {
       setFormData(prev => ({ 
         ...prev, 
         salary: '120 KD',
         skills: { ...prev.skills, cooking: true } 
       }));
    } else {
       setFormData(prev => ({ 
         ...prev, 
         salary: '110 KD',
         skills: { ...prev.skills, cooking: false } 
       }));
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

  const generatePDF = (office: string) => {
    generateCountryPDF(formData, 'kuwait', office);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in">
      <BackButton onClick={onBack} />
      <Header title="Kuwait CV Generator" subtitle="ALNOOR & FAHAD Offices" flag="🇰🇼" />

      <div className="kuwait-theme text-accentKuwait">
        <FormSection title="Personal Details" icon={<User />} accentColor="border-accentKuwait">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })} placeholder="JEMILA SHAFI ABAGISA" />
            <FormInput label="Ref No" value={formData.refNo} onChange={e => setFormData({ ...formData, refNo: e.target.value.toUpperCase() })} placeholder="TK-101" />
            <FormSelect label="Religion" options={['MUSLIM', 'CHRISTIAN']} value={formData.religion} onChange={e => setFormData({ ...formData, religion: e.target.value })} />
            <FormInput type="date" label="Date of Birth" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
            <FormInput label="Age" value={formData.age} readOnly className="opacity-70 cursor-not-allowed" />
            <FormInput label="Place of Birth" value={formData.pob} onChange={e => setFormData({ ...formData, pob: e.target.value.toUpperCase() })} placeholder="NEDI GIBE" />
            <FormSelect label="Marital Status" options={['SINGLE', 'MARRIED', 'DIVORCED']} value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })} />
            <FormInput label="Number of Children" value={formData.children} onChange={e => setFormData({ ...formData, children: e.target.value })} />
            
            <FormInput label="Salary" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
            <FormInput type="date" label="Date (Fahad Only)" value={formData.printDate} onChange={e => setFormData({ ...formData, printDate: e.target.value })} />
          </div>
        </FormSection>

        <FormSection title="Physical Details" icon={<Ruler />} accentColor="border-accentKuwait">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Height" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="1.62 M" />
              <FormInput label="Weight" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="55 KG" />
           </div>
        </FormSection>

        <FormSection title="Passport Details" icon={<FileText />} accentColor="border-accentKuwait">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Passport Number" value={formData.passportNumber} onChange={e => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })} />
            <FormInput type="date" label="Issue Date" value={formData.issueDate} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} />
            <FormInput label="Place of Issue" value={formData.placeOfIssue} onChange={e => setFormData({ ...formData, placeOfIssue: e.target.value.toUpperCase() })} />
            <FormInput type="date" label="Expiry Date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
          </div>
        </FormSection>

        <FormSection title="Language Proficiency" icon={<Languages />} accentColor="border-accentKuwait">
           <div className="space-y-4">
              {/* English */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-surfaceElevated pb-4">
                 <div className="w-32 font-bold text-white">ENGLISH</div>
                 <div className="flex gap-6">
                    {['POOR', 'FAIR', 'FLUENT'].map(level => (
                       <label key={`eng-${level}`} className="flex items-center gap-2 cursor-pointer">
                          <input 
                             type="radio" 
                             name="kw-english" 
                             className="accent-accentKuwait w-5 h-5"
                             checked={formData.englishLevel === level}
                             onChange={() => setFormData({...formData, englishLevel: level})}
                          />
                          <span className="text-slate-300 text-sm font-medium">{level}</span>
                       </label>
                    ))}
                 </div>
              </div>

              {/* Arabic */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                 <div className="w-32 font-bold text-white">ARABIC</div>
                 <div className="flex gap-6">
                    {['POOR', 'FAIR', 'FLUENT'].map(level => (
                       <label key={`ara-${level}`} className="flex items-center gap-2 cursor-pointer">
                          <input 
                             type="radio" 
                             name="kw-arabic" 
                             className="accent-accentKuwait w-5 h-5"
                             checked={formData.arabicLevel === level}
                             onChange={() => setFormData({...formData, arabicLevel: level})}
                          />
                          <span className="text-slate-300 text-sm font-medium">{level}</span>
                       </label>
                    ))}
                 </div>
              </div>
           </div>
        </FormSection>

        <FormSection title="Previous Employment" icon={<Briefcase />} accentColor="border-accentKuwait">
           <FormCheckbox 
              id="kw-hasExp" 
              label="HAS PREVIOUS EXPERIENCE" 
              checked={formData.hasExperience} 
              onChange={e => setFormData({...formData, hasExperience: e.target.checked})}
              className="mb-4 hover:border-accentKuwait"
           />
           {formData.hasExperience && (
              <div className="space-y-4 animate-fade-in-down">
                 <div className="p-3 border border-surfaceElevated rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Record 1</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <FormInput label="Country" value={formData.expCountry} onChange={e => setFormData({...formData, expCountry: e.target.value.toUpperCase()})} />
                       <FormInput label="Period (Years)" value={formData.expPeriod} onChange={e => setFormData({...formData, expPeriod: e.target.value})} />
                       <FormInput label="Position" value={formData.expPosition} readOnly />
                    </div>
                 </div>
                 <div className="p-3 border border-surfaceElevated rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Record 2 (Optional)</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <FormInput label="Country" value={formData.expCountry2} onChange={e => setFormData({...formData, expCountry2: e.target.value.toUpperCase()})} />
                       <FormInput label="Period (Years)" value={formData.expPeriod2} onChange={e => setFormData({...formData, expPeriod2: e.target.value})} />
                       <FormInput label="Position" value={formData.expPosition2} onChange={e => setFormData({...formData, expPosition2: e.target.value.toUpperCase()})} />
                    </div>
                 </div>
              </div>
           )}
        </FormSection>

        <FormSection title="Work Experience" icon={<Hammer />} accentColor="border-accentKuwait">
           <div className="flex flex-wrap gap-3">
              {Object.entries(formData.skills).map(([skill, checked]) => (
                 <FormCheckbox 
                    key={skill}
                    id={`kw-${skill}`}
                    label={skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                    checked={checked}
                    onChange={e => setFormData({...formData, skills: {...formData.skills, [skill]: e.target.checked}})}
                    className="flex-1 min-w-[150px] hover:border-accentKuwait"
                 />
              ))}
           </div>
        </FormSection>

        <FormSection title="Contact Information" icon={<Phone />} accentColor="border-accentKuwait">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Contact Person" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value.toUpperCase()})} />
              <FormInput label="Contact Phone" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} placeholder="251..." />
           </div>
        </FormSection>

        <FormSection title="Photos" icon={<ImageIcon />} accentColor="border-accentKuwait">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PhotoUpload label="FACE PHOTO" type="face" preview={formData.photos.face} onUpload={(f) => handlePhotoUpload('face', f)} colorClass="accentKuwait" />
              <PhotoUpload label="FULL BODY" type="full" preview={formData.photos.full} onUpload={(f) => handlePhotoUpload('full', f)} colorClass="accentKuwait" />
              <PhotoUpload label="PASSPORT" type="pass" preview={formData.photos.passport} onUpload={(f) => handlePhotoUpload('passport', f)} colorClass="accentKuwait" />
           </div>
        </FormSection>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
           <button 
              onClick={() => generatePDF('ALNOOR')}
              className="px-8 py-4 bg-surfaceElevated border-2 border-accentKuwait rounded-xl font-bold text-lg hover:bg-accentKuwait hover:text-white transition-all"
           >
              📄 Generate ALNOOR PDF
           </button>
           <button 
              onClick={() => generatePDF('FAHAD')}
              className="px-8 py-4 bg-surfaceElevated border-2 border-accentKuwait rounded-xl font-bold text-lg hover:bg-accentKuwait hover:text-white transition-all"
           >
              📄 Generate FAHAD PDF
           </button>
        </div>
      </div>
    </div>
  );
};

export default KuwaitForm;