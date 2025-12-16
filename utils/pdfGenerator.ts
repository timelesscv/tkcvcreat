import { BaseFormData, KuwaitFormData, SaudiFormData, JordanFormData, AllFormData } from '../types';

declare global {
  interface Window {
    jspdf: any;
  }
}

// ==========================================
// CONFIGURATION & TYPES
// ==========================================

interface Coord {
  x: number;
  y: number;
  size?: number; // Font size override
  color?: [number, number, number]; // RGB
  font?: string; // 'helvetica' | 'times' | 'courier'
}

interface PhotoCoord {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface FieldLayout {
  [key: string]: Coord | PhotoCoord | undefined;
  // Header
  appliedFor?: Coord;
  salary?: Coord;
  contractPeriod?: Coord;
  refNo?: Coord;
  agentName?: Coord;
  printDate?: Coord; // For Fahad
  
  // Personal
  fullName?: Coord;
  religion?: Coord;
  dob?: Coord;
  age?: Coord;
  pob?: Coord;
  maritalStatus?: Coord;
  children?: Coord;
  weight?: Coord;
  height?: Coord;
  education?: Coord;
  nationality?: Coord;
  
  // Passport
  passportNumber?: Coord;
  issueDate?: Coord;
  placeOfIssue?: Coord;
  expiryDate?: Coord;
  
  // Photos (Page 1 & Page 2)
  photoFace?: PhotoCoord;     // Page 1 Top
  photoFull?: PhotoCoord;     // Page 1 Bottom/Side
  photoPassport?: PhotoCoord; // Page 2 Center
  
  // Employment 1
  expCountry?: Coord;
  expPeriod?: Coord;
  expPosition?: Coord;
  
  // Employment 2 (New)
  expCountry2?: Coord;
  expPeriod2?: Coord;
  expPosition2?: Coord;

  // Grids
  skillsStart?: Coord; // Starting point for skills
  languagesStart?: Coord; // Starting point for languages
  
  // Contact
  contactName?: Coord;
  contactPhone?: Coord;
  contactRelationship?: Coord; // For Saudi
  contactAddress?: Coord;      // For Saudi
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${day} ${months[monthIndex]} ${year}`;
};

const formatDateNumeric = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper to adjust fullName layout based on character count
const adjustFullNameLayout = (data: BaseFormData, layout: FieldLayout, country: string, office: string): void => {
  if (!layout.fullName || !data.fullName) return;
  
  const charCount = data.fullName.length;
  const officeUpper = office.toUpperCase();
  
  // Deep clone the fullName layout to avoid mutating the original
  const fullNameLayout = { ...layout.fullName };
  
  // For Ewan, Option, Injaz, and Alnoor
  if (
    (country === 'jordan' && ['EWAN', 'OPTION', 'INJAZ'].includes(officeUpper)) ||
    (country === 'kuwait' && officeUpper === 'ALNOOR')
  ) {
    if (charCount >= 24) {
      fullNameLayout.size = (fullNameLayout.size || 11) - 2;
      fullNameLayout.x = fullNameLayout.x - 5;
    }
  }
  // For Aldhahran
  else if (country === 'saudi' && officeUpper === 'ALDHAHRAN') {
    if (charCount >= 19) {
      // Update to specific coordinates and size
      fullNameLayout.size = 9;
      fullNameLayout.x = 35;
      fullNameLayout.y = 55;
      fullNameLayout.font = 'helvetica';
      // Preserve color if exists
      if (!fullNameLayout.color) {
        fullNameLayout.color = [0, 0, 0]; // Default black
      }
    }
  }
  
  // Update the layout with adjusted fullName
  layout.fullName = fullNameLayout;
};

// ==========================================
// LAYOUT COORDINATES
// ==========================================

// Colors
const RED_HEX: [number, number, number] = [149, 23, 27];
const GREEN_HEX: [number, number, number] = [36, 158, 84];
const PURPLE_HEX: [number, number, number] = [95, 73, 122];

// --- KUWAIT: ALNOOR OFFICE ---
const LAYOUT_KUWAIT_ALNOOR: FieldLayout = {
  // Header
  salary: { x: 82, y: 61.5, color: GREEN_HEX, font: 'helvetica', size: 12 },
  refNo: { x: 93.5, y: 74.75, color: GREEN_HEX, font: 'helvetica', size: 11.5 },
  
  // Personal Details
  fullName: { x: 64, y: 91.5, color: RED_HEX, font: 'helvetica', size: 18 },
  religion: { x: 53, y: 117, color: RED_HEX, font: 'helvetica', size: 12 },
  dob: { x: 53, y: 126, color: RED_HEX, font: 'helvetica', size: 12 },
  age: { x: 53, y: 138, color: RED_HEX, font: 'helvetica', size: 12 },
  pob: { x: 49, y: 147, color: RED_HEX, font: 'helvetica', size: 10 },
  children: { x: 53, y: 156, color: RED_HEX, font: 'helvetica', size: 12 },
  weight: { x: 53, y: 163, color: RED_HEX, font: 'helvetica', size: 12 },
  height: { x: 53, y: 170, color: RED_HEX, font: 'helvetica', size: 12 },
  maritalStatus: { x: 53, y: 188, color: RED_HEX, font: 'helvetica', size: 14 },
  
  // Passport Details
  passportNumber: { x: 139.5, y: 103, color: RED_HEX, font: 'helvetica', size: 11 },
  issueDate: { x: 140, y: 110, color: RED_HEX, font: 'helvetica', size: 11 },
  expiryDate: { x: 140, y: 124, color: RED_HEX, font: 'helvetica', size: 11 },
  
  // Photos (Al Noor Specific)
  photoFace: { x: 159, y: 46, w: 34, h: 35 },
  photoFull: { x: 140, y: 135, w: 45, h: 140 }, // Page 1 Bottom Right
  photoPassport: { x: 12, y: 60, w: 183, h: 180 }, // Page 2 Center

  // Languages
  languagesStart: { x: 40, y: 168, color: RED_HEX, font: 'helvetica', size: 10.5 },
  
  // Employment
  expPeriod: { x: 20, y: 231, color: GREEN_HEX, font: 'helvetica', size: 12 },
  expPosition: { x: 31.5, y: 231, color: GREEN_HEX, font: 'helvetica', size: 11 },
  expCountry: { x: 56.5, y: 231, color: GREEN_HEX, font: 'helvetica', size: 13.25 },
  
  // Second Employment
  expPeriod2: { x: 20, y: 240, color: GREEN_HEX, font: 'helvetica', size: 12 },
  expPosition2: { x: 31.5, y: 240, color: GREEN_HEX, font: 'helvetica', size: 11 },
  expCountry2: { x: 56.5, y: 240, color: GREEN_HEX, font: 'helvetica', size: 13.25 },

  // Skills
  skillsStart: { x: 18, y: 263, color: RED_HEX, font: 'helvetica', size: 16 },

  // Contact Info - HIDDEN FOR AL NOOR
  contactName: { x: 0, y: 0 },
  contactPhone: { x: 0, y: 0 },
};

// --- KUWAIT: FAHAD OFFICE ---
const LAYOUT_KUWAIT_FAHAD: FieldLayout = {
  // Header
  refNo: { x: 43.75, y: 78.25, color: PURPLE_HEX, font: 'helvetica', size: 16 },
  salary: { x: 56, y: 94, color: PURPLE_HEX, font: 'helvetica', size: 16 },
  printDate: { x: 95.5, y: 66, color: [0,0,0], font: 'helvetica', size: 20 },
  
  // Personal Details
  fullName: { x: 44, y: 110, color: PURPLE_HEX, font: 'helvetica', size: 14 }, 
  religion: { x: 44, y: 130, color: PURPLE_HEX, font: 'helvetica', size: 11 }, 
  dob: { x: 44, y: 135, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  age: { x: 44, y: 141, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  pob: { x: 44, y: 147, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  children: { x: 44, y: 163, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  weight: { x: 44, y: 170, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  height: { x: 44, y: 177, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  maritalStatus: { x: 44, y: 156, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  
  // Passport Details
  passportNumber: { x: 150, y: 125.5, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  issueDate: { x: 150, y: 130.25, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  expiryDate: { x: 150, y: 140.5, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  
  // Photos
  photoFace: { x: 153, y: 64, w: 40, h: 41 },
  photoFull: { x: 145, y: 143, w: 32, h: 100 }, 
  photoPassport: { x: 12, y: 40, w: 183, h: 220 }, 

  // Languages
  languagesStart: { x: 40, y: 168, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  
  // Employment
  expPeriod: { x: 31.5, y: 231, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  expCountry: { x: 31.5, y: 226, color: PURPLE_HEX, font: 'helvetica', size: 11 },

  // Second Employment
  expPeriod2: { x: 59, y: 231, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  expCountry2: { x: 59, y: 226, color: PURPLE_HEX, font: 'helvetica', size: 11 },
  
  // Skills
  skillsStart: { x: 18, y: 263, color: PURPLE_HEX, font: 'helvetica', size: 11 },

  // Contact Info - HIDDEN FOR FAHAD
  contactName: { x: 0, y: 0 },
  contactPhone: { x: 0, y: 0 },
};

// --- SAUDI: ALDHAHRAN OFFICE ---
const LAYOUT_SAUDI_ALDHAHRAN: FieldLayout = {
  // NOTE: Original layout for short names (<19 chars)
  fullName: { x: 43, y: 55, font: 'helvetica' }, // Original: size 11 default
  religion: { x: 50, y: 72, font: 'helvetica' },
  dob: { x: 50, y: 79, font: 'helvetica' },
  pob: { x: 50, y: 91, font: 'helvetica' },
  maritalStatus: { x: 50, y: 104, font: 'helvetica' },
  age: { x: 50, y: 85, font: 'helvetica' },
  children: { x: 50, y: 110, font: 'helvetica' },
  height: { x: 163, y: 224, font: 'helvetica' },
  weight: { x: 163, y: 218, font: 'helvetica' },
  passportNumber: { x: 163, y: 72, font: 'helvetica' },
  
  expCountry: { x: 50, y: 138, font: 'helvetica' },
  expPeriod: { x: 50, y: 144, font: 'helvetica' },

  expCountry2: { x: 85, y: 138, font: 'helvetica' },
  expPeriod2: { x: 85, y: 144, font: 'helvetica' },

  salary: { x: 163, y: 55, font: 'helvetica' },
  
  contactName: { x: 40, y: 184, font: 'helvetica' },
  contactRelationship: { x: 40, y: 191, font: 'helvetica' },
  contactPhone: { x: 40, y: 196, font: 'helvetica' },
  contactAddress: { x: 40, y: 202, font: 'helvetica' },

  photoFull: { x: 145, y: 75.2, w: 45, h: 136 },
  photoPassport: { x: 12, y: 40, w: 183, h: 220 },

  skillsStart: { x: 1200, y: 224 },
  languagesStart: { x: 10, y: 165 }
};

// --- JORDAN: EWAN OFFICE ---
const LAYOUT_JORDAN_EWAN: FieldLayout = {
  refNo: { x: 141.5, y: 76.25, font: 'helvetica' },
  fullName: { x: 64, y: 96, font: 'helvetica', size: 18 },
  religion: { x: 53, y: 130, font: 'helvetica' },
  dob: { x: 50, y: 136, font: 'helvetica' },
  pob: { x: 50, y: 154, font: 'helvetica' },
  maritalStatus: { x: 50, y: 193, font: 'helvetica' },
  age: { x: 55, y: 144, font: 'helvetica', size: 12 },
  children: { x: 50, y: 162, font: 'helvetica' },
  height: { x: 50, y: 177, font: 'helvetica' }, 
  weight: { x: 50, y: 170, font: 'helvetica' }, 
  placeOfIssue: { x: 0, y: 0 }, 
  passportNumber: { x: 142.5, y: 104.5, font: 'helvetica' },
  issueDate: { x: 142.5, y: 112, font: 'helvetica' },
  expiryDate: { x: 142.5, y: 127, font: 'helvetica' },
  expCountry: { x: 55, y: 238, font: 'helvetica' },
  expPeriod: { x: 15, y: 238, font: 'helvetica' },
  expPosition: { x: 27, y: 238, font: 'helvetica' },
  
  expCountry2: { x: 55, y: 245, font: 'helvetica' },
  expPeriod2: { x: 15, y: 245, font: 'helvetica' },
  expPosition2: { x: 27, y: 245, font: 'helvetica' },

  photoFace: { x: 32.5, y: 46.5, w: 27, h: 35 },
  photoFull: { x: 132, y: 136, w: 42, h: 132 },
  photoPassport: { x: 12, y: 40, w: 183, h: 220 },

  skillsStart: { x: 1320, y: 175 },
  languagesStart: { x: 20, y: 175 },

  // CONTACT INFO - HIDDEN FOR EWAN (AS REQUESTED)
  contactName: { x: 0, y: 0 },
  contactPhone: { x: 0, y: 0 },
  contactRelationship: { x: 0, y: 0 },
  contactAddress: { x: 0, y: 0 }
};

// --- JORDAN: OPTION OFFICE ---
const LAYOUT_JORDAN_OPTION: FieldLayout = {
  refNo: { x: 139, y: 68.5, font: 'helvetica' },
  fullName: { x: 60, y: 89, font: 'helvetica', size: 16.5 },
  religion: { x: 53, y: 125, font: 'helvetica' },
  dob: { x: 50, y: 132, font: 'helvetica' },
  pob: { x: 50, y: 148, font: 'helvetica' },
  maritalStatus: { x: 50, y: 188, font: 'helvetica' },
  age: { x: 55, y: 142, font: 'helvetica', size: 12 },
  children: { x: 55, y: 155, font: 'helvetica' },
  height: { x: 50, y: 172, font: 'helvetica' },
  weight: { x: 50, y: 164, font: 'helvetica' },
  
  placeOfIssue: { x: 0, y: 0 }, 
  
  passportNumber: { x: 142.5, y: 104.5, font: 'helvetica' },
  issueDate: { x: 142.5, y: 112, font: 'helvetica' },
  expiryDate: { x: 142.5, y: 127, font: 'helvetica' },
  
  expCountry: { x: 55, y: 236, font: 'helvetica' },
  expPeriod: { x: 16, y: 236, font: 'helvetica' },
  expPosition: { x: 29.5, y: 236, font: 'helvetica' },

  photoFace: { x: 28.5, y: 45, w: 29, h: 34.5 },
  photoFull: { x: 132, y: 135, w: 38, h: 130 },
  photoPassport: { x: 12, y: 40, w: 183, h: 220 },

  skillsStart: { x: 1320, y: 175 }, 
  languagesStart: { x: 20, y: 175 },

  // CONTACT INFO - HIDDEN FOR OPTION (AS REQUESTED)
  contactName: { x: 0, y: 0 },
  contactPhone: { x: 0, y: 0 },
  contactRelationship: { x: 0, y: 0 },
  contactAddress: { x: 0, y: 0 }
};

// --- JORDAN: INJAZ OFFICE ---
const LAYOUT_JORDAN_INJAZ: FieldLayout = {
  refNo: { x: 141.5, y: 59.5, font: 'helvetica' },
  fullName: { x: 64, y: 76, font: 'helvetica', size: 18 },
  religion: { x: 58, y: 110, font: 'helvetica' },
  dob: { x: 55, y: 116, font: 'helvetica' },
  pob: { x: 52, y: 132, font: 'helvetica' },
  maritalStatus: { x: 58, y: 154, font: 'helvetica' },
  age: { x: 58, y: 124, font: 'helvetica', size: 12 },
  children: { x: 58, y: 140, font: 'helvetica' },
  height: { x: 58, y: 162, font: 'helvetica' },
  weight: { x: 58, y: 148, font: 'helvetica' },
  placeOfIssue: { x: 0, y: 0 }, 
  passportNumber: { x: 146.5, y: 98, font: 'helvetica' },
  issueDate: { x: 146.5, y: 105.25, font: 'helvetica' },
  expiryDate: { x: 146.5, y: 119.5, font: 'helvetica' },
  expCountry: { x: 62, y: 229, font: 'helvetica' },
  expPeriod: { x: 22, y: 229, font: 'helvetica' },
  expPosition: { x: 34, y: 229, font: 'helvetica' },

  expCountry2: { x: 62, y: 236, font: 'helvetica' },
  expPeriod2: { x: 22, y: 236, font: 'helvetica' },
  expPosition2: { x: 34, y: 236, font: 'helvetica' },

  photoFace: { x: 20, y: 33.5, w: 27, h: 34 },
  photoFull: { x: 136, y: 131.5, w: 44, h: 135 },
  photoPassport: { x: 12, y: 40, w: 183, h: 220 },
  skillsStart: { x: 1320, y: 175 },
  languagesStart: { x: 20, y: 175 },

  // Contact Info - HIDDEN FOR INJAZ (as per your comment)
  contactName: { x: 0, y: 0 },
  contactPhone: { x: 0, y: 0 },
  contactRelationship: { x: 0, y: 0 },
  contactAddress: { x: 0, y: 0 }
};

const getLayout = (country: string, office: string): FieldLayout => {
  const off = office.toUpperCase();
  if (country === 'kuwait') {
    return off === 'FAHAD' ? LAYOUT_KUWAIT_FAHAD : LAYOUT_KUWAIT_ALNOOR;
  }
  if (country === 'saudi') return LAYOUT_SAUDI_ALDHAHRAN;
  if (country === 'jordan') {
     if (off === 'INJAZ') return LAYOUT_JORDAN_INJAZ;
     if (off === 'OPTION') return LAYOUT_JORDAN_OPTION;
     return LAYOUT_JORDAN_EWAN;
  }
  return LAYOUT_KUWAIT_ALNOOR;
};

// ==========================================
// DRAWING UTILS
// ==========================================

const drawCheckmark = (doc: any, x: number, y: number, size: number = 5, color: [number, number, number] = [0, 0, 0]) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.line(x, y, x + size/3, y + size); // Down stroke
  doc.line(x + size/3, y + size, x + size, y - size/2); // Up stroke
};

// ==========================================
// MAIN GENERATOR
// ==========================================

export const generateCountryPDF = async (
  data: KuwaitFormData | SaudiFormData | JordanFormData | AllFormData,
  country: 'kuwait' | 'saudi' | 'jordan',
  office: string
) => {
  console.log("GENERATOR V17 LOADED: " + country + " - " + office + " (EWAN & OPTION contact removed)");

  if (!window.jspdf) {
    alert("Error: jsPDF library not loaded. Please refresh.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const layout = getLayout(country, office);
  
  // Apply full name layout adjustments based on character count
  adjustFullNameLayout(data, layout, country, office);
  
  const isFahad = country === 'kuwait' && office.toUpperCase() === 'FAHAD';

  // Helper to draw text
  const draw = (text: string | undefined, coord: Coord | undefined) => {
    if (!text || !coord) return;
    if (coord.x === 0 && coord.y === 0) return; // Explicit hide (for contact info)

    doc.setTextColor(...(coord.color || [0, 0, 0]));
    doc.setFontSize(coord.size || 11);
    doc.setFont(coord.font || 'helvetica', 'bold');
    doc.text(text.toString(), coord.x, coord.y);
  };

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // 1. LOAD TEMPLATE PAGES
  const templateBase = `${country}_${office.toLowerCase()}`;
  const extensions = ['.jpg', '.JPG', '.png', '.jpeg'];
  
  let bg1: HTMLImageElement | null = null;
  let bg2: HTMLImageElement | null = null;

  for (const ext of extensions) {
    try {
      if (!bg1) bg1 = await loadImage(`/templates/${templateBase}_1${ext}`);
    } catch(e) {}
    try {
      if (!bg2) bg2 = await loadImage(`/templates/${templateBase}_2${ext}`);
    } catch(e) {}
  }

  // ----------------------------------------
  // PAGE 1
  // ----------------------------------------
  if (bg1) {
    doc.addImage(bg1, 'JPEG', 0, 0, 210, 297);
  }

  // Draw Header
  draw(data.refNo, layout.refNo);
  
  let salaryText = '';
  if ('salary' in data) {
    salaryText = (data as KuwaitFormData).salary;
    if (isFahad) {
        salaryText = salaryText.replace(/ KD/i, '').trim();
    }
  } else if ('monthlySalary' in data) {
    salaryText = (data as SaudiFormData | AllFormData).monthlySalary;
  }
  draw(salaryText, layout.salary);

  draw('2 YEARS', layout.contractPeriod);
  draw('TK-AGENT', layout.agentName);
  draw('HOUSEMAID', layout.appliedFor);
  
  if (isFahad && 'printDate' in data) {
     const pData = data as KuwaitFormData;
     draw(formatDateNumeric(pData.printDate), layout.printDate);
  }

  // Draw Personal
  draw(data.fullName, layout.fullName);
  draw(data.religion, layout.religion);
  draw(formatDate(data.dob), layout.dob);
  draw(data.age, layout.age);
  draw(data.pob, layout.pob);
  draw(data.maritalStatus, layout.maritalStatus);
  draw(data.children, layout.children);
  
  if ('weight' in data) draw(data.weight, layout.weight);
  if ('height' in data) draw(data.height, layout.height);
  if ('education' in data) draw(data.education, layout.education);
  draw('ETHIOPIAN', layout.nationality);

  // Passport
  draw(data.passportNumber, layout.passportNumber);
  draw(formatDate(data.issueDate), layout.issueDate);
  draw(data.placeOfIssue, layout.placeOfIssue);
  draw(formatDate(data.expiryDate), layout.expiryDate);

  // Employment
  if (data.hasExperience) {
    draw(data.expCountry, layout.expCountry);
    draw(data.expPeriod, layout.expPeriod);
    draw(data.expPosition, layout.expPosition);

    if (data.expCountry2) {
       draw(data.expCountry2, layout.expCountry2);
       draw(data.expPeriod2, layout.expPeriod2);
       draw(data.expPosition2, layout.expPosition2);
    }
  }

  // Contact - ONLY for offices that should show it
  if ('contactPerson' in data) {
     const cData = data as KuwaitFormData | SaudiFormData | AllFormData;
     
     // Only draw contact info if coordinates are not hidden (x:0, y:0)
     if (layout.contactName && (layout.contactName.x !== 0 || layout.contactName.y !== 0)) {
         draw(cData.contactPerson, layout.contactName);
         draw(cData.contactPhone, layout.contactPhone);
         if ('relationship' in cData) {
             const sData = cData as SaudiFormData | AllFormData;
             draw(sData.relationship, layout.contactRelationship);
             draw(sData.address, layout.contactAddress);
         }
     }
     // No fallback drawing for offices with hidden contact
  }

  // Photos (Page 1)
  if (data.photos.face && layout.photoFace) {
    doc.addImage(data.photos.face, 'JPEG', layout.photoFace.x, layout.photoFace.y, layout.photoFace.w, layout.photoFace.h);
  }
  if (data.photos.full && layout.photoFull) {
    doc.addImage(data.photos.full, 'JPEG', layout.photoFull.x, layout.photoFull.y, layout.photoFull.w, layout.photoFull.h);
  }

  // --- SKILLS & LANGUAGES ---
  const RED = [149, 23, 27];
  
  // KUWAIT LOGIC
  if (country === 'kuwait') {
      const kData = data as KuwaitFormData;
      
      // Fahad: Checkmark for Cooking
      if (isFahad) {
         if (kData.skills.cooking) drawCheckmark(doc, 106.5, 239, 2.5, [0,0,0]);
      } else {
         // Alnoor: YES text
         if (kData.skills.cooking) {
            doc.setTextColor(...RED);
            doc.setFont('helvetica', 'bold');
            doc.text('YES', 18, 263); 
         }
      }

      // Alnoor Languages
      if (!isFahad) {
         doc.setTextColor(...RED);
         doc.setFont('helvetica', 'bold');
         if (kData.englishLevel === 'POOR') doc.text('YES', 53, 210);
         if (kData.englishLevel === 'FAIR') doc.text('YES', 74, 210);
         if (kData.englishLevel === 'FLUENT') doc.text('YES', 95, 210);
         
         if (kData.arabicLevel === 'POOR') doc.text('YES', 53, 205);
         if (kData.arabicLevel === 'FAIR') doc.text('YES', 74, 205);
         if (kData.arabicLevel === 'FLUENT') doc.text('YES', 95, 205);
      } else {
         // Fahad Languages
         doc.setTextColor(...PURPLE_HEX);
         doc.setFont('helvetica', 'bold');
         if (kData.englishLevel === 'POOR') doc.text('YES', 45, 207.25);
         if (kData.englishLevel === 'FAIR') doc.text('YES', 45, 212);
         if (kData.englishLevel === 'FLUENT') doc.text('YES', 45, 216.75);

         if (kData.arabicLevel === 'POOR') doc.text('YES', 69, 207.25);
         if (kData.arabicLevel === 'FAIR') doc.text('YES', 69, 212);
         if (kData.arabicLevel === 'FLUENT') doc.text('YES', 69, 216.75);
      }
  }

  // SAUDI LOGIC
  if (country === 'saudi') {
     const sData = data as SaudiFormData;
     if (sData.skills.cooking) {
         drawCheckmark(doc, 70, 166.5, 2.5, [0,0,0]);
     }
     
     doc.setTextColor(0,0,0);
     doc.setFont('helvetica', 'bold');
     if (sData.englishLevel === 'FLUENT') doc.text('YES', 40, 224);
     if (sData.englishLevel === 'FAIR') doc.text('YES', 68, 224);
     if (sData.englishLevel === 'POOR') doc.text('YES', 96, 224);

     if (sData.arabicLevel === 'FLUENT') doc.text('YES', 40, 230);
     if (sData.arabicLevel === 'FAIR') doc.text('YES', 68, 230);
     if (sData.arabicLevel === 'POOR') doc.text('YES', 96, 230);
  }

  // JORDAN LOGIC
  if (country === 'jordan') {
     const jData = data as JordanFormData;
     
     if (office.toLowerCase() === 'injaz') {
        if (jData.skills.cooking) drawCheckmark(doc, 65.75, 265.5, 2.5, [0,0,0]);
        
        doc.setTextColor(0,0,0);
        doc.setFont('helvetica', 'bold');
        if (jData.englishLevel === 'POOR') doc.text('YES', 55, 202);
        if (jData.englishLevel === 'FAIR') doc.text('YES', 75, 202);
        if (jData.englishLevel === 'FLUENT') doc.text('YES', 95, 202);

        if (jData.arabicLevel === 'POOR') doc.text('YES', 55, 197.5);
        if (jData.arabicLevel === 'FAIR') doc.text('YES', 75, 197.5);
        if (jData.arabicLevel === 'FLUENT') doc.text('YES', 95, 197.5);
     } else if (office.toLowerCase() === 'option') {
        doc.setTextColor(0,0,0);
        doc.setFont('helvetica', 'bold');
        if (jData.englishLevel === 'POOR') doc.text('YES', 35, 212.5);
        if (jData.englishLevel === 'FAIR') doc.text('YES', 50, 212.5);
        if (jData.englishLevel === 'FLUENT') doc.text('YES', 80, 212.5);

        if (jData.arabicLevel === 'POOR') doc.text('YES', 35, 207);
        if (jData.arabicLevel === 'FAIR') doc.text('YES', 50, 207);
        if (jData.arabicLevel === 'FLUENT') doc.text('YES', 80, 207);
     } else {
        doc.setTextColor(0,0,0);
        doc.setFont('helvetica', 'bold');
        if (jData.englishLevel === 'POOR') doc.text('YES', 45, 217);
        if (jData.englishLevel === 'FAIR') doc.text('YES', 65, 217);
        if (jData.englishLevel === 'FLUENT') doc.text('YES', 85, 217);

        if (jData.arabicLevel === 'POOR') doc.text('YES', 45, 213);
        if (jData.arabicLevel === 'FAIR') doc.text('YES', 65, 213);
        if (jData.arabicLevel === 'FLUENT') doc.text('YES', 85, 213);
     }
  }

  // ----------------------------------------
  // PAGE 2
  // ----------------------------------------
  doc.addPage();
  if (bg2) {
    doc.addImage(bg2, 'JPEG', 0, 0, 210, 297);
  }

  if (data.photos.passport && layout.photoPassport) {
    doc.addImage(data.photos.passport, 'JPEG', layout.photoPassport.x, layout.photoPassport.y, layout.photoPassport.w, layout.photoPassport.h);
  }

  // SAVE FILE
  const safeName = data.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  const safeRef = data.refNo ? data.refNo.replace(/[^a-zA-Z0-9]/g, '-') : 'REF';
  const fileName = `TK-${safeRef}_${safeName}_${office}.pdf`;
  doc.save(fileName);
};
