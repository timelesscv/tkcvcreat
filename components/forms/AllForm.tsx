
import React, { useState, useEffect } from 'react';
import { AllFormData } from '../../types';
import { FormInput, FormSelect, FormCheckbox, FormSection, PhotoUpload, Header, BackButton } from '../ui/FormComponents';
import { User, FileText, Languages, Briefcase, Hammer, Phone, Image as ImageIcon, DollarSign, Hash, Calendar } from 'lucide-react';
import { generateCountryPDF } from '../../utils/pdfGenerator';

interface Props {
  onBack: () => void;
}

const AllForm: React.FC<Props> = ({ onBack }) => {
  const [formData, setFormData] = useState<AllFormData>({
    fullName: '', 
    refNo: '', // Fallback
    refAlnoor: '', refFahad: '', refAldhahran: '', refEwan: '', refOption: '', refInjaz: '',
    printDate: '', // For Fahad
    religion: 'MUSLIM', dob: '', age: '', pob: 'ADDIS ABABA', maritalStatus: 'SINGLE', children: '0',
    education: 'HIGH SCHOOL', weight: '55 KG', height: '1.62 M',
    passportNumber: '', issueDate: '', placeOfIssue: 'ADDIS ABABA', expiryDate: '',
    hasExperience: false, expCountry: '', expPeriod: '', expPosition: 'HOUSEMAID',
    expCountry2: '', expPeriod2: '', expPosition2: 'HOUSEMAID',
    englishLevel: '', arabicLevel: '',
    appliedFor: 'HOUSEMAID', monthlySalary: '1000 SR',
    contactPerson: '', relationship: 'FATHER', contactPhone: '', address: '',
    skills: { cooking: false, babySitting: true, cleaning: true, washing: true, ironing: true, sewing: false },
    photos: { face: null, full: null, passport: null }
  });

  // Auto set print date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, printDate: today }));
  }, []);

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
    const parts = formData.fullName.trim().split(/\s+/);
    if (parts.length > 1) {
      setFormData(prev => ({ ...prev, contactPerson: parts.slice(1).join(' ') }));
    }
  }, [formData.fullName]);

  useEffect(() => {
    if (formData.hasExperience) {
       setFormData(prev => ({ ...prev, monthlySalary: '1200 SR', skills: { ...prev.skills, cooking: true } }));
    } else {
       setFormData(prev => ({ ...prev, monthlySalary: '1000 SR', skills: { ...prev.skills, cooking: false } }));
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

  const generateAll = async () => {
    alert(`Generating All 6 PDFs... (Please wait for all downloads)`);
    
    // Determine Kuwait Salary override
    const kuwaitSalary = formData.hasExperience ? '120 KD' : '110 KD';

    // Base data with salary and printDate available for casting
    const baseKuwaitData = {
        ...formData,
        salary: kuwaitSalary,
        // printDate is already in formData
    };

    try {
      // 1. Kuwait Alnoor
      await generateCountryPDF(
        { ...baseKuwaitData, refNo: formData.refAlnoor || formData.refNo }, 
        'kuwait', 'ALNOOR'
      );
      await new Promise(r => setTimeout(r, 500));
      
      // 2. Kuwait Fahad
      await generateCountryPDF(
        { ...baseKuwaitData, refNo: formData.refFahad || formData.refNo }, 
        'kuwait', 'FAHAD'
      );
      await new Promise(r => setTimeout(r, 500));
      
      // 3. Saudi Aldhahran
      await generateCountryPDF(
        { ...formData, refNo: formData.refAldhahran || formData.refNo }, 
        'saudi', 'ALDHAHRAN'
      );
      await new Promise(r => setTimeout(r, 500));
      
      // 4. Jordan Ewan
      await generateCountryPDF(
        { ...formData, refNo: formData.refEwan || formData.refNo }, 
        'jordan', 'EWAN'
      );
      await new Promise(r => setTimeout(r, 500));
      
      // 5. Jordan Option (Disable Cleaning Skill)
      const optionSkills = { ...formData.skills, cleaning: false };
      await generateCountryPDF(
        { ...formData, skills: optionSkills, refNo: formData.refOption || formData.refNo }, 
        'jordan', 'OPTION'
      );
      await new Promise(r => setTimeout(r, 500));
      
      // 6. Jordan Injaz
      await generateCountryPDF(
        { ...formData, refNo: formData.refInjaz || formData.refNo }, 
        'jordan', 'INJAZ'
      );
      
      alert('✅ Successfully generated all 6 PDFs!');
    } catch (error) {
      console.error(error);
      alert('Error generating PDFs. Check console.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in">
      <BackButton onClick={onBack} />
      <Header title="Generate All CVs" subtitle="6 Offices • 3 Countries • One Click" flag="🌍" />

      <div className="text-accentAll">
        <FormSection title="Reference Numbers" icon={<Hash />} accentColor="border-accentAll">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput label="ALNOOR (KW)" value={formData.refAlnoor} onChange={e => setFormData({ ...formData, refAlnoor: e.target.value.toUpperCase() })} placeholder="TK-..." />
              <FormInput label="FAHAD (KW)" value={formData.refFahad} onChange={e => setFormData({ ...formData, refFahad: e.target.value.toUpperCase() })} placeholder="TK-..." />
              <FormInput label="ALDHAHRAN (SA)" value={formData.refAldhahran} onChange={e => setFormData({ ...formData, refAldhahran: e.target.value.toUpperCase() })} placeholder="TK-..." />
              <FormInput label="EWAN (JO)" value={formData.refEwan} onChange={e => setFormData({ ...formData, refEwan: e.target.value.toUpperCase() })} placeholder="JO-..." />
              <FormInput label="OPTION (JO)" value={formData.refOption} onChange={e => setFormData({ ...formData, refOption: e.target.value.toUpperCase() })} placeholder="JO-..." />
              <FormInput label="INJAZ (JO)" value={formData.refInjaz} onChange={e => setFormData({ ...formData, refInjaz: e.target.value.toUpperCase() })} placeholder="JO-..." />
           </div>
        </FormSection>

        <FormSection title="Kuwait Specifics" icon={<Calendar />} accentColor="border-accentAll">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormInput type="date" label="Print Date (Fahad Only)" value={formData.printDate} onChange={e => setFormData({ ...formData, printDate: e.target.value })} />
            </div>
        </FormSection>

        <FormSection title="Combined Details" icon={<User />} accentColor="border-accentAll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })} placeholder="JEMILA SHAFI ABAGISA" />
            <FormSelect label="Religion" options={['MUSLIM', 'CHRISTIAN']} value={formData.religion} onChange={e => setFormData({ ...formData, religion: e.target.value })} />
            <FormInput type="date" label="Date of Birth" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
            <FormInput label="Age" value={formData.age} readOnly className="opacity-70 cursor-not-allowed" />
            <FormInput label="Place of Birth" value={formData.pob} onChange={e => setFormData({ ...formData, pob: e.target.value.toUpperCase() })} placeholder="ADDIS ABABA" />
            <FormSelect label="Marital Status" options={['SINGLE', 'MARRIED', 'DIVORCED']} value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })} />
            <FormInput label="Number of Children" value={formData.children} onChange={e => setFormData({ ...formData, children: e.target.value })} />
            <FormInput label="Education (For Saudi/Injaz)" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value.toUpperCase() })} />
          </div>
        </FormSection>

        <FormSection title="Physical Details" icon={<User />} accentColor="border-accentAll">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Height (For Jordan/Kuwait)" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="1.62 M" />
              <FormInput label="Weight (For Jordan/Kuwait)" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="55 KG" />
           </div>
        </FormSection>

        <FormSection title="Passport Details" icon={<FileText />} accentColor="border-accentAll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Passport Number" value={formData.passportNumber} onChange={e => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })} />
            <FormInput type="date" label="Issue Date" value={formData.issueDate} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} />
            <FormInput label="Place of Issue" value={formData.placeOfIssue} onChange={e => setFormData({ ...formData, placeOfIssue: e.target.value.toUpperCase() })} />
            <FormInput type="date" label="Expiry Date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
          </div>
        </FormSection>

        <FormSection title="Language Proficiency" icon={<Languages />} accentColor="border-accentAll">
           <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-surfaceElevated pb-4">
                 <div className="w-32 font-bold text-white">ENGLISH</div>
                 <div className="flex gap-6">
                    {['POOR', 'FAIR', 'FLUENT'].map(level => (
                       <label key={`eng-${level}`} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="all-english" className="accent-accentAll w-5 h-5" checked={formData.englishLevel === level} onChange={() => setFormData({...formData, englishLevel: level})} />
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
                          <input type="radio" name="all-arabic" className="accent-accentAll w-5 h-5" checked={formData.arabicLevel === level} onChange={() => setFormData({...formData, arabicLevel: level})} />
                          <span className="text-slate-300 text-sm font-medium">{level}</span>
                       </label>
                    ))}
                 </div>
              </div>
           </div>
        </FormSection>

        <FormSection title="Previous Employment" icon={<Briefcase />} accentColor="border-accentAll">
           <FormCheckbox 
              id="all-hasExp" label="HAS PREVIOUS EXPERIENCE" checked={formData.hasExperience} onChange={e => setFormData({...formData, hasExperience: e.target.checked})} className="mb-4 hover:border-accentAll"
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

        <FormSection title="Work Experience (Combined)" icon={<Hammer />} accentColor="border-accentAll">
           <div className="flex flex-wrap gap-3">
              {Object.entries(formData.skills).map(([skill, checked]) => (
                 <FormCheckbox 
                    key={skill} id={`all-${skill}`} label={skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1').trim()} checked={checked} onChange={e => setFormData({...formData, skills: {...formData.skills, [skill]: e.target.checked}})} className="flex-1 min-w-[150px] hover:border-accentAll"
                 />
              ))}
           </div>
        </FormSection>

        <FormSection title="Saudi Specifics" icon={<DollarSign />} accentColor="border-accentAll">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Applied For" value={formData.appliedFor} onChange={e => setFormData({...formData, appliedFor: e.target.value.toUpperCase()})} />
              <FormInput label="Monthly Salary" value={formData.monthlySalary} onChange={e => setFormData({...formData, monthlySalary: e.target.value})} />
           </div>
        </FormSection>

        <FormSection title="Contact Info" icon={<Phone />} accentColor="border-accentAll">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Contact Name" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value.toUpperCase()})} />
              <FormInput label="Relationship (Saudi)" value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value.toUpperCase()})} />
              <FormInput label="Contact Phone" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
              <FormInput label="Address (Saudi)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value.toUpperCase()})} />
           </div>
        </FormSection>

        <FormSection title="Photos" icon={<ImageIcon />} accentColor="border-accentAll">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PhotoUpload label="FACE PHOTO" type="face" preview={formData.photos.face} onUpload={(f) => handlePhotoUpload('face', f)} colorClass="accentAll" />
              <PhotoUpload label="FULL BODY" type="full" preview={formData.photos.full} onUpload={(f) => handlePhotoUpload('full', f)} colorClass="accentAll" />
              <PhotoUpload label="PASSPORT" type="pass" preview={formData.photos.passport} onUpload={(f) => handlePhotoUpload('passport', f)} colorClass="accentAll" />
           </div>
        </FormSection>

        <div className="flex justify-center mt-10">
           <button onClick={generateAll} className="px-12 py-5 bg-gradient-to-r from-accentAll to-orange-600 rounded-xl font-bold text-xl shadow-lg shadow-accentAll/20 hover:shadow-accentAll/40 transform hover:-translate-y-1 transition-all text-white">
              🌍 Generate All 6 PDFs
           </button>
        </div>
      </div>
    </div>
  );
};

export default AllForm;
