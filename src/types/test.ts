export type TestStatus = 'planned' | 'in-progress' | 'completed' | 'failed' | 'cancelled';

export interface TestLocation {
    name: string;
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
}

export interface TestRecord {
    id: string;
    name: string;
    description: string;
    manufacturer: string;
    location: TestLocation;
    startDate: string;
    endDate: string;  
    startTime?: string;
    endTime?: string;  
    status: TestStatus;
    progress: number;  
    successRate: number;
    participants: number;
    tags: string[];
    createdAt?: string;
    startedAt?: string;
}

export type CreateTestInput = Omit<TestRecord, 'id'>;