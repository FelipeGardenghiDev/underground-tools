import { 
  BandProfile, 
  GigDate, 
  InputListChannel, 
  MerchItem, 
  SetlistItem, 
  StageItem, 
  TechRider 
} from '@/types';
import { 
  initialBandProfile, 
  initialGigs, 
  initialInputList, 
  initialMerch, 
  initialSetlist, 
  initialStageItems, 
  initialTechRider 
} from './mock-data';

export interface AppStoredData {
  version: string;
  updatedAt: string;
  profile: BandProfile;
  stageItems: StageItem[];
  inputList: InputListChannel[];
  techRider: TechRider;
  gigs: GigDate[];
  merch: MerchItem[];
  setlist: SetlistItem[];
}

const STORAGE_KEY = 'underground_tools_band_data_v1';

export function loadStoredData(): AppStoredData {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();

    const parsed = JSON.parse(raw) as Partial<AppStoredData>;
    return {
      version: parsed.version || '0.1.0',
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      profile: parsed.profile || initialBandProfile,
      stageItems: parsed.stageItems || initialStageItems,
      inputList: parsed.inputList || initialInputList,
      techRider: parsed.techRider || initialTechRider,
      gigs: parsed.gigs || initialGigs,
      merch: parsed.merch || initialMerch,
      setlist: parsed.setlist || initialSetlist,
    };
  } catch (err) {
    console.warn('Falha ao carregar dados locais, usando padrão:', err);
    return getDefaultData();
  }
}

export function saveStoredData(data: AppStoredData): void {
  if (typeof window === 'undefined') return;

  try {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Falha ao salvar no localStorage:', err);
  }
}

export function getDefaultData(): AppStoredData {
  return {
    version: '0.1.0',
    updatedAt: new Date().toISOString(),
    profile: initialBandProfile,
    stageItems: initialStageItems,
    inputList: initialInputList,
    techRider: initialTechRider,
    gigs: initialGigs,
    merch: initialMerch,
    setlist: initialSetlist,
  };
}

export function exportBackupFile(data: AppStoredData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = `${data.profile.slug || 'banda'}-underground-tools-${new Date().toISOString().slice(0, 10)}.ugt.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importBackupFile(file: File): Promise<AppStoredData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as AppStoredData;
        if (!parsed.profile || !parsed.stageItems) {
          throw new Error('Arquivo .ugt.json inválido ou corrompido.');
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
