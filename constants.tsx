
import React from 'react';
import { UserRole, UserStatus, User, CropStatus, Demand, Contract } from './types';

export const TRANSLATIONS = {
  en: {
    heroTitle: "No Seed Without a Buyer",
    heroSubtitle: "Revolutionizing Indian agriculture with demand-driven cultivation and farm-gate logistics.",
    postDemand: "Post Demand",
    sellCrop: "Sell Your Crop",
    farmerLogin: "Farmer Login",
    buyerLogin: "Buyer Login",
    howItWorks: "How It Works",
    impact: "Impact Metrics",
    krishiScore: "Krishi Score",
    acceptDemand: "Accept Demand",
    sendWhatsapp: "Send Update via WhatsApp",
    requestPickup: "Request Farm-Gate Pickup",
    escrowStatus: "Escrow Milestones"
  },
  hi: {
    heroTitle: "बिना ग्राहक के बीज नहीं",
    heroSubtitle: "मांग-आधारित खेती और फार्म-गेट लॉजिस्टिक्स के साथ भारतीय कृषि में क्रांति।",
    postDemand: "मांग दर्ज करें",
    sellCrop: "अपनी फसल बेचें",
    farmerLogin: "किसान लॉगिन",
    buyerLogin: "खरीददार लॉगिन",
    howItWorks: "यह कैसे काम करता है",
    impact: "प्रभाव मेट्रिक्स",
    krishiScore: "कृषि स्कोर",
    acceptDemand: "मांग स्वीकार करें",
    sendWhatsapp: "व्हाट्सएप अपडेट भेजें",
    requestPickup: "खेत से पिकअप मांगें",
    escrowStatus: "एस्क्रो चरण"
  }
};

export const MOCK_USERS: User[] = [
  {
    id: 'f1',
    name: 'Rajesh Kumar',
    role: UserRole.FARMER,
    phone: '+91 9876543210',
    email: 'rajesh@farmer.com',
    location: 'Ratnagiri, MH',
    status: UserStatus.APPROVED,
    kycStatus: 'VERIFIED',
    krishiScore: 840,
    registrationDate: '2024-01-15',
    documents: {
      idProofUrl: 'https://picsum.photos/seed/id1/400/300',
      selfieUrl: 'https://picsum.photos/seed/selfie1/400/400',
      profilePhotoUrl: 'https://picsum.photos/seed/rajesh/400/400'
    },
    metadata: { landSize: 5, crops: ['Mango', 'Cashew'], bankAccount: 'XXXX XXXX 1234' }
  },
  {
    id: 'b2',
    name: 'Anjali Gupta',
    role: UserRole.BUYER,
    phone: '+91 9998887776',
    email: 'procurement@bigbazar.com',
    location: 'Mumbai, MH',
    status: UserStatus.APPROVED,
    kycStatus: 'VERIFIED',
    registrationDate: '2024-02-10',
    metadata: { businessName: 'BigBazar Agri', buyerType: 'Wholesaler', gst: '27AAACG0000A1Z5' }
  },
  {
    id: 'p1',
    name: 'Suresh Patil',
    role: UserRole.FARMER,
    phone: '+91 8887776665',
    email: 'suresh@patil.com',
    location: 'Nashik, MH',
    status: UserStatus.PENDING,
    kycStatus: 'PENDING',
    registrationDate: '2024-03-20',
    documents: {
      idProofUrl: 'https://picsum.photos/seed/id2/400/300',
      selfieUrl: 'https://picsum.photos/seed/selfie2/400/400',
      profilePhotoUrl: 'https://picsum.photos/seed/suresh/400/400'
    },
    metadata: { landSize: 12, crops: ['Grapes', 'Onions'] }
  },
  {
    id: 'admin1',
    name: 'System Admin',
    role: UserRole.ADMIN,
    phone: '+91 0000000000',
    email: 'admin@fasalsetu.in',
    location: 'Delhi',
    status: UserStatus.APPROVED,
    kycStatus: 'VERIFIED',
    registrationDate: '2023-10-01'
  },
  {
    id: 't1',
    name: 'Arjun Transport',
    role: UserRole.TRANSPORTER,
    phone: '+91 7776665554',
    email: 'arjun@logistics.com',
    location: 'Ratnagiri, MH',
    status: UserStatus.APPROVED,
    kycStatus: 'VERIFIED',
    registrationDate: '2024-02-01',
    metadata: { vehicleType: '10 Wheeler Truck', regNumber: 'MH 12 AB 9999', radius: 500 }
  }
];

export const MOCK_DEMANDS: Demand[] = [
  {
    id: 'd1',
    buyerId: 'b1',
    cropName: 'Basmati Rice',
    quantity: 50,
    qualityGrade: 'A',
    targetPrice: 4500,
    status: 'OPEN',
    description: 'Looking for organic long-grain basmati for export.',
    shippingBudget: 5000,
    deliveryLocation: { lat: 28.6139, lng: 77.2090, address: "New Delhi Warehouse" }
  },
  {
    id: 'd2',
    buyerId: 'b2',
    cropName: 'Alphonso Mango',
    quantity: 10,
    qualityGrade: 'A',
    targetPrice: 12000,
    status: 'MATCHED',
    description: 'Premium quality for retail chain in Mumbai.',
    shippingBudget: 3500,
    deliveryLocation: { lat: 19.0760, lng: 72.8777, address: "Mumbai Retail Hub" }
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    demandId: 'd2',
    farmerId: 'f1',
    buyerId: 'b2',
    fruitType: 'Alphonso Mango',
    totalAmount: 120000,
    shippingPrice: 3500,
    escrowBalance: 36000, 
    status: CropStatus.GROWTH,
    currentHealthScore: 88,
    pickupRequested: false,
    pickupLocation: { lat: 16.9902, lng: 73.3120, address: "Ratnagiri Orchard #44" },
    deliveryLocation: { lat: 19.0760, lng: 72.8777, address: "Mumbai Hub Central" },
    milestones: [
      { label: 'Agreement', percentage: 30, status: 'PAID', isApprovalRequired: false },
      { label: 'Growth & Flowering', percentage: 15, status: 'PENDING', isApprovalRequired: true },
      { label: 'Harvest & Packaging', percentage: 55, status: 'PENDING', isApprovalRequired: true }
    ],
    updates: [
      {
        id: 'u2',
        type: 'SAPLING',
        timestamp: '2024-03-01T09:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=80',
        notes: 'Saplings verified by AI. Predicted harvest: June 15.',
        location: { lat: 16.9902, lng: 73.3120 },
        aiAnalysis: {
          healthScore: 92,
          detectedStage: 'SAPLING',
          freshnessScore: 100,
          fraudAlert: false,
          prediction: 'Strong growth pattern detected.'
        }
      },
      {
        id: 'u1',
        type: 'FERTILIZER',
        timestamp: '2024-03-10T10:30:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1622383529957-cf1abc1571bc?auto=format&fit=crop&w=800&q=80',
        notes: 'First batch of organic fertilizers applied.',
        location: { lat: 16.9902, lng: 73.3120 }
      }
    ],
    auditTrail: [
      { timestamp: '2024-03-01T10:00:00Z', event: 'Sapling Verified by AI Engine', actor: 'System' },
      { timestamp: '2024-03-10T10:05:00Z', event: '30% Advance Payment Released', actor: 'Buyer' }
    ],
    pickupOTP: '8812',
    deliveryOTP: '4459'
  }
];
