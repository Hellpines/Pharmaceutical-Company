import { type CreateTestInput } from '../types/test';

type SeedItem = CreateTestInput & { createdAt: string };

export const INITIAL_TESTS: SeedItem[] = [
  {
    name: 'CardioShield-V',
    description: 'Research on the effectiveness of a cardioprotective agent under stress.',
    manufacturer: 'BioPharma Lab',
    location: { name: 'Berlin Central Hospital', address: 'Charitéplatz 1', city: 'Berlin', country: 'Germany', lat: 52.5251, lng: 13.3776 },
    startDate: '2026-08-10', endDate: '2026-12-01', startTime: '09:00', endTime: '18:00',
    status: 'in-progress', progress: 45, successRate: 88, participants: 1200, tags: ['Cardiology', 'Phase II'],
    createdAt: '2026-08-10T09:30:00Z'
  },
  {
    name: 'GastroHeal',
    description: 'Phase II trials for advanced ulcer healing compound.',
    manufacturer: 'MedDigestive',
    location: { name: 'Madrid Clinic', address: 'Calle de Atocha 1', city: 'Madrid', country: 'Spain', lat: 40.4125, lng: -3.6931 },
    startDate: '2026-08-15', endDate: '2026-11-20', startTime: '08:00', endTime: '14:00',
    status: 'completed', progress: 100, successRate: 92, participants: 450, tags: ['Gastroenterology'],
    createdAt: '2026-08-15T11:00:00Z'
  },
  {
    name: 'VisionClear Drops',
    description: 'Testing new eye drops for dry eye syndrome.',
    manufacturer: 'OptiCare',
    location: { name: 'Toronto Eye Center', address: '123 Vision Way', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
    startDate: '2026-08-25', endDate: '2026-09-15', startTime: '10:00', endTime: '16:00',
    status: 'failed', progress: 100, successRate: 41, participants: 300, tags: ['Ophthalmology'],
    createdAt: '2026-08-25T14:15:00Z'
  },

  {
    name: 'MigraCalm-X',
    description: 'Clinical trials for a new migraine and headache medication.',
    manufacturer: 'Serenity Health Clinic',
    location: { name: 'Brooklyn Medical Center', address: '434 Rockaway Ave', city: 'New York', country: 'USA', lat: 40.6782, lng: -73.9442 },
    startDate: '2026-09-01', endDate: '2026-10-15', startTime: '10:00', endTime: '16:00',
    status: 'planned', progress: 0, successRate: 0, participants: 520, tags: ['Medicine', 'Phase III'],
    createdAt: '2026-09-02T10:00:00Z'
  },
  {
    name: 'DermaProtect+',
    description: 'Sunburn and UV damage recovery lotion testing.',
    manufacturer: 'SkinLife Co.',
    location: { name: 'Sydney Skin Institute', address: 'Bondi Beach 45', city: 'Sydney', country: 'Australia', lat: -33.8915, lng: 151.2767 },
    startDate: '2026-09-10', endDate: '2026-10-10', startTime: '07:00', endTime: '19:00',
    status: 'in-progress', progress: 65, successRate: 85, participants: 800, tags: ['Dermatology'],
    createdAt: '2026-09-12T08:20:00Z'
  },
  {
    name: 'ImmunoBoost-G',
    description: 'Testing of an immunomodulating vaccine.',
    manufacturer: 'Global Vaccine Co.',
    location: { name: 'London Clinical Research Unit', address: 'Euston Rd 215', city: 'London', country: 'UK', lat: 51.5255, lng: -0.1278 },
    startDate: '2026-09-15', endDate: '2026-11-20', startTime: '11:00', endTime: '17:00',
    status: 'in-progress', progress: 30, successRate: 76, participants: 1500, tags: ['Immunology', 'Phase I'],
    createdAt: '2026-09-16T13:45:00Z'
  },
  {
    name: 'NeuroFlex Ultra',
    description: 'Testing of a nootropic complex for improving memory.',
    manufacturer: 'Synapse Tech',
    location: { name: 'Tokyo Pharma Institute', address: 'Chiyoda City 3-2', city: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917 },
    startDate: '2026-09-20', endDate: '2026-12-30', startTime: '08:00', endTime: '15:00',
    status: 'completed', progress: 100, successRate: 94, participants: 800, tags: ['Neurology', 'Phase III'],
    createdAt: '2026-09-22T09:10:00Z'
  },

  {
    name: 'RespiraAir',
    description: 'Asthma inhaler formulation stability test.',
    manufacturer: 'BreatheEasy Labs',
    location: { name: 'Oslo Medical Hub', address: 'Storgata 1', city: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522 },
    startDate: '2026-09-28', endDate: '2026-10-05', startTime: '09:00', endTime: '17:00',
    status: 'in-progress', progress: 80, successRate: 90, participants: 250, tags: ['Pulmonology'],
    createdAt: '2026-09-28T16:00:00Z'
  },
  {
    name: 'OsteoFix',
    description: 'Bone density supplement trial for seniors.',
    manufacturer: 'Geriatric Health',
    location: { name: 'Boston General', address: '55 Fruit St', city: 'Boston', country: 'USA', lat: 42.3628, lng: -71.0683 },
    startDate: '2026-09-30', endDate: '2026-11-01', startTime: '08:00', endTime: '12:00',
    status: 'planned', progress: 0, successRate: 0, participants: 600, tags: ['Orthopedics'],
    createdAt: '2026-09-30T10:30:00Z'
  },
  {
    name: 'HepatoCare',
    description: 'Liver enzyme regulation clinical trial.',
    manufacturer: 'BioPharma Lab',
    location: { name: 'Paris Health Center', address: 'Rue de Rivoli', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    startDate: '2026-10-01', endDate: '2026-12-15', startTime: '09:00', endTime: '18:00',
    status: 'in-progress', progress: 10, successRate: 95, participants: 1100, tags: ['Hepatology'],
    createdAt: '2026-10-01T11:20:00Z'
  }
];