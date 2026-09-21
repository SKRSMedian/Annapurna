export type ActiveTab = 'welcome' | 'market' | 'farmer-hub' | 'track-and-trace' | 'profiles' | 'orders';

export type Language = 'en' | 'hi' | 'pa' | 'mr' | 'te';

export interface FarmerVerificationDetails {
  status: 'verified' | 'pending';
  docType: 'pm_kisan' | 'kcc' | 'land_record';
  docNumber: string;
  landRecordDetails?: {
    khasraNumber?: string;
    khatauniNumber?: string;
    landAreaAcres?: number;
    subDistrict?: string;
  };
  kccDetails?: {
    bankName?: string;
    creditLimit?: number;
  };
  certificateFileName?: string;
  submittedAt: string;
  verifiedAt?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  role: 'farmer' | 'consumer';
  state: string;
  district: string;
  preferredLanguage: Language;
  isVerified: boolean;
  farmName?: string;
  farmSizeAcres?: number;
  primaryCrops?: string[];
  farmerVerification?: FarmerVerificationDetails;
}

export interface ProduceListing {
  id: string;
  name: string;
  hindiName: string;
  regionalNames?: Partial<Record<Language, string>>;
  category: 'veg' | 'grains' | 'fruits' | 'pulses' | 'dairy';
  farmerName: string;
  farmerHub: string;
  state?: string;
  district?: string;
  distance: string;
  price: number;
  retailPrice: number;
  mandiRate?: number;
  unit: string;
  stockAvailable: number;
  stockTotal: number;
  image: string;
  harvestTime: string;
  qualityTag: string;
  verifiedOrganic: boolean;
  minQty?: number;
  notes: string;
  inquiries?: number;
}

export interface CartItem {
  produce: ProduceListing;
  quantity: number;
}

export interface DirectOrderItem {
  name: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  total: number;
  image?: string;
}

export type TransportVehicleType = '2-wheeler' | '3-wheeler' | 'tempo' | 'truck';

export interface TransportVehicleOption {
  type: TransportVehicleType;
  title: string;
  hindiTitle: string;
  subtitle: string;
  icon: string;
  maxWeightKg: number;
  capacityLabel: string;
  recommendedFor: string;
  baseFare: number;
  transitSpeed: string;
  estimatedTimeMins: number;
  coldChainReady: boolean;
}

export interface AssignedDriver {
  name: string;
  phone: string;
  photo?: string;
  rating: number;
  tripsCount: number;
  vehicleType: TransportVehicleType;
  vehicleTypeName: string;
  vehiclePlateNumber: string;
  liveSpeedKmH: number;
  chamberTempC?: number;
  batteryPercent?: number;
  statusMessage?: string;
}

export interface AvailableDriverVehicle {
  id: string;
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  driverRating: number;
  driverTrips: number;
  driverBadge: string;
  isVerified: boolean;
  vehicleType: TransportVehicleType;
  vehicleTypeName: string;
  vehicleModel: string;
  vehiclePlateNumber: string;
  capacityLimitKg: number;
  capacityLabel: string;
  ratePerKm: number;
  estimatedDeliveryCost: number;
  etaMins: number;
  coldChainReady: boolean;
  proximityKm: number;
  currentHub: string;
  features: string[];
}

export type OrderTrackingMilestone =
  | 'driver_assigned'
  | 'picked_up_farm'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export interface TrackingMilestoneInfo {
  key: OrderTrackingMilestone;
  title: string;
  hindiTitle: string;
  description: string;
  time?: string;
  completed: boolean;
  current: boolean;
}

export interface DirectOrder {
  id: string;
  orderNumber?: string;
  buyerName?: string;
  buyerLocation?: string;
  farmerName: string;
  farmLocation: string;
  placedAt: string;
  eta: string;
  status: string;
  items: DirectOrderItem[];
  totalAmount: number;
  farmerShare: number;
  transitFee: number;
  platformFee: number;
  cancelReason?: string;
  // Enhanced transport and driver tracking
  transportVehicle?: TransportVehicleType;
  vehicleDetails?: {
    type: TransportVehicleType;
    name: string;
    plateNumber: string;
    capacity: string;
    temperatureControlled: boolean;
  };
  driver?: AssignedDriver;
  currentMilestone?: OrderTrackingMilestone;
  milestones?: TrackingMilestoneInfo[];
  distanceRemainingKm?: number;
  originHub?: string;
  destinationHub?: string;
}

// Region-Based Smart Recommendations & Insights Types
export interface WeatherForecast {
  temperature: number;
  condition: string;
  conditionIcon: string;
  humidity: number;
  rainfallChance: number;
  windSpeedKm: number;
  advisoryHeadline: string;
  advisoryDetail: string;
  optimalWindow: string;
  actionType: 'harvest_alert' | 'sowing_window' | 'irrigation_pause' | 'favorable';
  hourlyForecast: { time: string; temp: string; rainProb: number; icon: string }[];
}

export interface LogisticsProvider {
  id: string;
  name: string;
  type: 'cold_chain_ev' | 'refrigerated_van' | 'cooperative_truck' | 'cold_storage';
  route: string;
  capacityAvailable: string;
  departureTime: string;
  rate: string;
  phone: string;
  verifiedPartner: boolean;
  temperatureZone?: string;
  badge: string;
  vehicleNumber?: string;
}

export interface TrendingProduce {
  id: string;
  cropName: string;
  regionalName: string;
  category: string;
  urbanDemandIndex: number; // e.g. +42%
  annapurnaPrice: number;
  mandiPrice: number;
  unit: string;
  bestHubMarket: string;
  reason: string;
  image: string;
  seasonTag: string;
}

export interface RegionalInsightData {
  regionKey: string;
  regionName: string;
  state: string;
  district: string;
  hubName: string;
  weather: WeatherForecast;
  logistics: LogisticsProvider[];
  trendingProduce: TrendingProduce[];
}

export type NetworkMode = 'online' | 'offline';

export interface NetworkStatus {
  isOnline: boolean;
  effectiveType?: string;
  networkType?: string;
  downlinkSpeedMbps?: number;
  rttMs?: number;
  isSimulated: boolean;
  lastChecked: Date;
}

export interface QueuedOfflineAction {
  id: string;
  type: 'order_draft' | 'listing_update' | 'price_alert' | 'advisory_query' | 'note';
  payload: any;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  description: string;
}

export interface RagKnowledgeDoc {
  id: string;
  title: string;
  category: 'farming_guide' | 'weather_advisory' | 'transport_faq' | 'mandi_reference';
  region?: string;
  content: string;
  tags: string[];
  referenceCode: string;
}

export interface RagQueryResult {
  answer: string;
  pipeline: 'cloud_vector_db' | 'local_on_device_vector_rag';
  sources: {
    docId: string;
    title: string;
    referenceCode: string;
    snippet: string;
    similarityScore: number;
  }[];
  latencyMs: number;
}

