
export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  TRANSPORTER = 'TRANSPORTER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEACTIVATED = 'DEACTIVATED'
}

export enum CropStatus {
  SOWING = 'SOWING',
  GROWTH = 'GROWTH',
  FLOWERING = 'FLOWERING',
  HARVEST_READY = 'HARVEST_READY',
  PACKAGING = 'PACKAGING',
  AWAITING_DISPATCH = 'AWAITING_DISPATCH',
  TRANSIT_ASSIGNED = 'TRANSIT_ASSIGNED',
  REACHED_PICKUP = 'REACHED_PICKUP',
  PICKUP_CHECKPOINT = 'PICKUP_CHECKPOINT', 
  COLLECTED = 'COLLECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  REACHED_DESTINATION = 'REACHED_DESTINATION',
  DELIVERED = 'DELIVERED',
  DISPUTED = 'DISPUTED',
  COMPLETED = 'COMPLETED'
}

export interface LatLng {
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  password?: string;
  location: string;
  status: UserStatus;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  krishiScore?: number;
  transporterRating?: number;
  registrationDate: string;
  documents?: {
    idProofUrl: string;
    selfieUrl: string;
    profilePhotoUrl: string;
    roleSpecificDocs?: string[];
  };
  metadata?: {
    landSize?: number;
    crops?: string[];
    bankAccount?: string;
    businessName?: string;
    buyerType?: 'Wholesaler' | 'Retailer' | 'Exporter';
    gst?: string;
    vehicleType?: string;
    regNumber?: string;
    radius?: number;
  };
}

export interface AuditEntry {
  timestamp: string;
  event: string;
  actor: string;
}

export interface Demand {
  id: string;
  buyerId: string;
  cropName: string;
  quantity: number;
  qualityGrade: string;
  targetPrice: number;
  status: 'OPEN' | 'MATCHED' | 'CANCELLED';
  description: string;
  shippingBudget: number;
  deliveryLocation: LatLng;
}

export interface AIAnalysis {
  healthScore: number;
  detectedStage: string;
  ripeness?: 'UNRIPE' | 'MATURING' | 'RIPE' | 'OVERRIPE';
  grade?: 'A' | 'B' | 'C';
  issues?: string[];
  freshnessScore: number;
  fraudAlert: boolean;
  prediction?: string;
}

export interface Contract {
  id: string;
  demandId: string;
  farmerId: string;
  buyerId: string;
  transporterId?: string;
  pickupRequested?: boolean;
  totalAmount: number;
  shippingPrice: number;
  escrowBalance: number;
  status: CropStatus;
  milestones: Milestone[];
  updates: CropUpdate[];
  collectedAt?: string;
  deliveredAt?: string;
  pickupLocation?: LatLng;
  deliveryLocation?: LatLng;
  transporterCurrentLocation?: LatLng;
  packageCount?: number;
  packageWeight?: number;
  packagingType?: 'Crate' | 'Sack' | 'Box';
  packagingDate?: string;
  packagingPhotos?: string[];
  pickupOTP?: string;
  deliveryOTP?: string;
  auditTrail: AuditEntry[];
  // AI Module specific
  currentHealthScore?: number;
  predictedHarvestDate?: string;
  fruitType: string;
  // Trust & Verification Module
  transporterCheckpointPhotos?: string[];
  transporterVideoProof?: string;
  transporterConditionNote?: 'GOOD' | 'MINOR_DAMAGE' | 'DEFECTIVE';
  buyerConfirmationDeadline?: string;
  disputeDetails?: {
    type: 'QUALITY' | 'QUANTITY' | 'DAMAGE';
    comment: string;
    proofUrl?: string;
    timestamp: string;
  };
  adminResolution?: string;
}

export interface Milestone {
  label: string;
  percentage: number;
  status: 'PENDING' | 'PAID';
  isApprovalRequired: boolean;
}

export interface CropUpdate {
  id: string;
  type?: 'FERTILIZER' | 'FLOWERING' | 'HARVEST' | 'PACKAGING' | 'LOGISTICS' | 'GENERAL' | 'SAPLING' | 'GROWTH' | 'RIPENESS';
  timestamp: string;
  imageUrl: string;
  notes: string;
  location: { lat: number; lng: number };
  aiAnalysis?: AIAnalysis;
}

export interface Language {
  code: 'en' | 'hi';
  name: string;
}
