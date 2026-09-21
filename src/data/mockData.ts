import {
  ProduceListing,
  DirectOrder,
  RegionalInsightData,
  TransportVehicleOption,
  AvailableDriverVehicle
} from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1V4wOtFbvNZ9gzMmDowafg1BVwDMgoyq3tpGtD57WPn-y1NceT2x_TLBoH91NK_gl30qRJqMDx0DFdEqnIUeUdDIM_w63KxKzY1CO3lC6B5Tpz5uXJyIQwE2AeLReQxjItAzNwOzPkKRCWImB62fzRg4xSTZWhffD72SznsLtiWxswdvC9kZbAhHk9B7LlA3I2097R48D_E9BeYlGjrGeuIxfWbyl1ORJqOZ8oBTWAYU4KsnjmSX6Q',
  gurpreetProfile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFOBqR6JHDhW-fp7QfyrkEJZRsgPesYQ20_6mUz509L7vL6lS9Mi-Pt8hbp1dw1qhw37rk5zQG_S5XP6WsVnoqz6yb5u4A2yR0nl0_4Q_PA21bZRKgNGsMBqx1D9CVVrQF5RRVoY8yCp4CWT6aCtisnrbLOSg18JPjh7Y1H2U6grvvUSJCxg571xtPXTSRkwuGDIrLIDgPdRdR143_EcqrpUwmzo5b8HTklZLP19ldlzC5I_1zAg',
  smallAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMkpAZNzAlaGF43JZBH94iiOpwtbVO6-vCbTTYpe58o5IlF3GxC3tcA7mZU51SsSRyKj0RzyWuiYhL1iN3UfXhcE5csDOP0SHDOv9BgZfzBc4DYiRT6JDlPwd9qH3U12SFxZc5ALsH_PK2WSaHOzJ393xUno9_z0Hmy1jxyervkadHwikBBo3jD_l3zZWmOxhvD6vFA5MeeGWp9yBSZCkp78UomFEXWvc9cParKkhxZXqgCYVEBA',
  gurpreetWarmPortrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzWk43KWJ1P3rjnAMYFFvRizOxazcSRhi5aVCGsKXVn7qY2FI8PSEeuVV050JCL_klfOUoH2jwBQwEfUXy8nF6RTOoWW5l23kn-RhZA0hrk10GLg-XLyQBcBcowtL_Yi7XszOqk6eg4Fgztu1BQeWaCvdokfv2fx1PiI0jNwwWQJdMzdnKXQTjdyOzQYpUr7Nu73fDv1qcxhZCaj6B8PD881kOqlCd1r39q5ErdOioQqMgZwWMMg',
  
  // Crop listings
  tomatoesListing: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeCMbJnNxTDIlGDA6RKhayuSSCzp7n64bv4wXSdbD2Vw_DW0WGCWErHHPY5J07kQxu9d26e40exwpseGJt648qOKPi6DvEznf6EeAGS_IQiuEsEV40HXZMAqxBqy5WivukGt1Wx4mWEWykdl8Yejv-WUBQp8MqPU1heuaXfFvmkT9UWSs_otf6njU1A-bqnoPjmTc056w50DpI_4aueNuWstB2RDI908gI6d8AUuoB7Bcaqpq8Lg',
  marketTomatoes: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  potatoesListing: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  wheatListing: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  marketWheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  onionsListing: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
  mustardOil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  capsicumListing: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
  garlicListing: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
  chilliListing: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
  spinachListing: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
  mangoListing: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
  
  // Farmer portraits
  balwantSingh: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  rameshShinde: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  lakshmiDevi: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  rajeshPatel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',

  // Facilities & Transit
  mapView: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5C2qjbgDysDJFG0Nj_At7eYWsxsuDL4TVhXz2Sh3Vo4gKunQwx1HpSkme2JMR2elLUoMACPMMNCuJ7DV9wn_7mTrVL8-ci2HdiRNRkFVbIxRZSBTDXo4K2kJSAJPH3_MOqc9Y5gjHNgWXmG4A2SCFRWmeYTcFgJPHjUTkYpJyVizaWt1lC_NtY2FOVnoSIvI40ttGelENGEfJJbfeKdTI0DJR8MLAk5OiwPKcU_pLKGwo-g8umg',
  coldStorageFacility: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  evTransitVan: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
  weatherRadarSky: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80',
  mandiAuctionYard: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  farmerWelcomeBanner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
  consumerWelcomeBanner: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80',
  heroFarm: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
};

export const INITIAL_PRODUCE: ProduceListing[] = [
  {
    id: 'prod-1',
    name: 'Hybrid Red Tomatoes (Roma)',
    hindiName: 'टमाटर',
    regionalNames: {
      en: 'Hybrid Red Tomatoes (Roma)',
      hi: 'ऑर्गेनिक लाल टमाटर',
      pa: 'ਦੇਸੀ ਲਾਲ ਟਮਾਟਰ',
      mr: 'सेंद्रिय लाल टोमॅटो',
      te: 'నాటు ఆర్గానిక్ టమాటాలు'
    },
    category: 'veg',
    farmerName: 'Balwant Singh',
    farmerHub: 'Nashik Hub',
    state: 'Maharashtra',
    district: 'Nashik',
    distance: '28 km away',
    price: 28.5,
    retailPrice: 45.0,
    mandiRate: 21.0,
    unit: 'kg',
    stockAvailable: 850,
    stockTotal: 1200,
    image: ASSETS.marketTomatoes,
    harvestTime: 'Picked Yesterday (04 Sep)',
    qualityTag: 'Grade A • Export Quality',
    verifiedOrganic: true,
    inquiries: 14,
    notes: '100% Pesticide residue tested lot • Zero cold storage waxing',
  },
  {
    id: 'prod-2',
    name: 'Sharbati Golden Wheat',
    hindiName: 'शरबती गेहूं',
    regionalNames: {
      en: 'Sharbati Golden Wheat',
      hi: 'शरबती दानेदार गेहूं',
      pa: 'ਸ਼ਰਬਤੀ ਸੁਨਹਿਰੀ ਕਣਕ',
      mr: 'शरबती सुवर्ण गहू',
      te: 'శర్బతి గోధుమలు'
    },
    category: 'grains',
    farmerName: 'Gurpreet Singh',
    farmerHub: 'Ludhiana Organic Farms',
    state: 'Punjab',
    district: 'Ludhiana',
    distance: 'MP Origin Hub',
    price: 38.0,
    retailPrice: 46.0,
    mandiRate: 28.5,
    unit: 'kg',
    stockAvailable: 5000,
    stockTotal: 5000,
    image: ASSETS.marketWheat,
    harvestTime: '100% Sun-Dried • Low Moisture <11%',
    qualityTag: 'Unpolished Grade A Heirloom',
    verifiedOrganic: true,
    minQty: 5,
    inquiries: 8,
    notes: 'Dispatches via direct farmer grain-van. Direct bag tagging.',
  },
  {
    id: 'prod-3',
    name: 'Fresh Red Onions',
    hindiName: 'लासलगाव प्याज',
    regionalNames: {
      en: 'Fresh Red Onions (Lasalgaon)',
      hi: 'लासलगांव लाल प्याज',
      pa: 'ਤਾਜ਼ਾ ਲਾਲ ਪਿਆਜ਼',
      mr: 'लासलगाव दर्जेदार कांदा',
      te: 'ఎర్ర ఉల్లిపాయలు'
    },
    category: 'veg',
    farmerName: 'Ramesh Shinde',
    farmerHub: 'Lasalgaon Mandi Link',
    state: 'Maharashtra',
    district: 'Nashik',
    distance: '44 km away',
    price: 32.0,
    retailPrice: 48.0,
    mandiRate: 23.0,
    unit: 'kg',
    stockAvailable: 1400,
    stockTotal: 2000,
    image: ASSETS.onionsListing,
    harvestTime: 'Naturally sun-cured for 4 days',
    qualityTag: 'High Shelf-Life (55+ mm)',
    verifiedOrganic: false,
    notes: 'GI Region: Lasalgaon. Zero anti-sprouting chemicals.',
  },
  {
    id: 'prod-4',
    name: 'Jyoti Table Potatoes (Grade A)',
    hindiName: 'आलू',
    regionalNames: {
      en: 'Jyoti Table Potatoes (Grade A)',
      hi: 'ज्योति आलू (ग्रेड-ए)',
      pa: 'ਤਾਜ਼ੇ ਆਲੂ (ਗਰੇਡ ਏ)',
      mr: 'ज्योती बटाटा (ग्रेड-ए)',
      te: 'బంగాళాదుంపలు (గ్రేడ్-A)'
    },
    category: 'veg',
    farmerName: 'Ramesh Shinde',
    farmerHub: 'Agra Cold Hub',
    state: 'Uttar Pradesh',
    district: 'Agra',
    distance: '42 km away',
    price: 18.0,
    retailPrice: 26.0,
    mandiRate: 13.5,
    unit: 'kg',
    stockAvailable: 2400,
    stockTotal: 3000,
    image: ASSETS.potatoesListing,
    harvestTime: 'Stored: Agra Cold Hub • Harvested 01 Sep',
    qualityTag: 'Certified Cold Hub Batch #JP-29',
    verifiedOrganic: true,
    notes: 'Direct farm harvested, crisp unwashed skin with rich natural sweetness.',
  },
  {
    id: 'prod-5',
    name: 'Pure Cold-Pressed Mustard Oil',
    hindiName: 'कच्ची घानी सरसों तेल',
    regionalNames: {
      en: 'Pure Cold-Pressed Mustard Oil',
      hi: 'काठ घानी शुद्ध सरसों तेल',
      pa: 'ਕੋਹਲੂ ਦਾ ਸ਼ੁੱਧ ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ',
      mr: 'लाकडी घाणा मोहरी तेल',
      te: 'గానుగ ఆవనూనె'
    },
    category: 'dairy',
    farmerName: 'Gurpreet Singh',
    farmerHub: 'Khed Shivapur, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    distance: '42 km away',
    price: 210.0,
    retailPrice: 260.0,
    mandiRate: 175.0,
    unit: 'Litre',
    stockAvailable: 80,
    stockTotal: 100,
    image: ASSETS.mustardOil,
    harvestTime: 'Small Batch Wood-Churned',
    qualityTag: 'Kachi Ghani Cold Press',
    verifiedOrganic: true,
    notes: 'Wood-churned, unrefined, single-origin desi sarson seed oil.',
  },
  {
    id: 'prod-6',
    name: 'Crisp Green Capsicum (Shimla Mirch)',
    hindiName: 'हरी शिमला मिर्च',
    regionalNames: {
      en: 'Crisp Green Capsicum',
      hi: 'ताज़ी हरी शिमला मिर्च',
      pa: 'ਹਰੀ ਸ਼ਿਮਲਾ ਮਿਰਚ',
      mr: 'ताजी हिरवी ढोबळी मिरची',
      te: 'తాజా బెంగళూరు మిరపకాయలు'
    },
    category: 'veg',
    farmerName: 'Rajesh Patel',
    farmerHub: 'Indore Malwa Agro',
    state: 'Madhya Pradesh',
    district: 'Indore',
    distance: '35 km away',
    price: 48.0,
    retailPrice: 72.0,
    mandiRate: 34.0,
    unit: 'kg',
    stockAvailable: 600,
    stockTotal: 800,
    image: ASSETS.capsicumListing,
    harvestTime: 'Picked this morning 05:30 AM',
    qualityTag: 'Polyhouse Naturally Grown',
    verifiedOrganic: true,
    notes: 'Sweet, crisp, thick-walled bell peppers harvested in early dawn.',
  },
  {
    id: 'prod-7',
    name: 'Guntur Sun-Dried Red Chillies',
    hindiName: 'गुंटूर सूखी लाल मिर्च',
    regionalNames: {
      en: 'Guntur Sun-Dried Red Chillies',
      hi: 'गुंटूर तीखी सूखी मिर्च',
      pa: 'ਗੁੰਟੂਰ ਲਾਲ ਮਿਰਚ',
      mr: 'गुंटूर सेंद्रिय लाल सुकी मिरची',
      te: 'గుంటూరు సన్నం ఎండిన మిర్చి'
    },
    category: 'pulses',
    farmerName: 'Lakshmi Devi',
    farmerHub: 'Guntur Organic Spices',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    distance: 'Direct Hub Dispatch',
    price: 220.0,
    retailPrice: 310.0,
    mandiRate: 170.0,
    unit: 'kg',
    stockAvailable: 1500,
    stockTotal: 2000,
    image: ASSETS.chilliListing,
    harvestTime: '100% Sun-Dried on Bamboo Tarps',
    qualityTag: 'Sannam S4 • Pure Natural Heat',
    verifiedOrganic: true,
    notes: 'Zero artificial dye or chemical spray. Pure pungent capsaicin rich lot.',
  },
  {
    id: 'prod-8',
    name: 'Desi White Garlic Bulbs (Malwa)',
    hindiName: 'देसी लहसुन',
    regionalNames: {
      en: 'Desi White Garlic Bulbs',
      hi: 'मालवा देशी सफेद लहसुन',
      pa: 'ਦੇਸੀ ਚਿੱਟਾ ਲਸਣ',
      mr: 'गावरान पांढरा लसूण',
      te: 'నాటు తెల్ల వెల్లుల్లి'
    },
    category: 'veg',
    farmerName: 'Rajesh Patel',
    farmerHub: 'Ujjain Malwa Mandi',
    state: 'Madhya Pradesh',
    district: 'Indore',
    distance: '48 km away',
    price: 180.0,
    retailPrice: 240.0,
    mandiRate: 130.0,
    unit: 'kg',
    stockAvailable: 950,
    stockTotal: 1200,
    image: ASSETS.garlicListing,
    harvestTime: 'Well-cured 20 days in shade',
    qualityTag: 'High Allicin Medical Grade',
    verifiedOrganic: true,
    notes: 'Single-origin desi garlic cloves with intense medicinal pungency.',
  }
];

export const TRANSPORT_VEHICLE_OPTIONS: TransportVehicleOption[] = [
  {
    type: '2-wheeler',
    title: '2-Wheeler Express',
    hindiTitle: 'टू-व्हीलर एक्सप्रेस',
    subtitle: 'Urgent small batches & single crate direct drop',
    icon: 'two_wheeler',
    maxWeightKg: 15,
    capacityLabel: 'Up to 15 kg (1-2 Crates)',
    recommendedFor: 'Best for urgent deliveries, daily salad greens, coriander, chillies & single bags',
    baseFare: 35.0,
    transitSpeed: 'Swift City Agility',
    estimatedTimeMins: 45,
    coldChainReady: false
  },
  {
    type: '3-wheeler',
    title: '3-Wheeler / Auto Cargo',
    hindiTitle: '3-व्हीलर / ऑटो कार्गो',
    subtitle: 'Standard household & small bulk produce',
    icon: 'electric_rickshaw',
    maxWeightKg: 80,
    capacityLabel: '15 kg – 80 kg (3-6 Crates)',
    recommendedFor: 'Ideal for weekly vegetable baskets, potato & onion sacks, and medium family orders',
    baseFare: 65.0,
    transitSpeed: 'Urban Eco-Transit',
    estimatedTimeMins: 75,
    coldChainReady: false
  },
  {
    type: 'tempo',
    title: 'Tempo / EV Mini Truck',
    hindiTitle: 'टेम्पो / ईवी मिनी ट्रक (छोटा हाथी)',
    subtitle: 'Medium bulk & apartment community groups',
    icon: 'local_shipping',
    maxWeightKg: 500,
    capacityLabel: '80 kg – 500 kg (10-35 Crates)',
    recommendedFor: 'Recommended for grain bags, community bulk buying, and temperature-sensitive berries/tomatoes',
    baseFare: 125.0,
    transitSpeed: 'Cold-Chain Refrigerated (14°C)',
    estimatedTimeMins: 110,
    coldChainReady: true
  },
  {
    type: 'truck',
    title: 'Heavy Commercial Truck',
    hindiTitle: 'भारी कमर्शियल ट्रक (आयशर/कैंटर)',
    subtitle: 'Large-scale commercial & wholesale lots',
    icon: 'rv_hookup',
    maxWeightKg: 3500,
    capacityLabel: '500 kg – 3,500+ kg (Full Harvest Bed)',
    recommendedFor: 'Commercial restaurants, organic markets, food processors, and wholesale farm-gate lots',
    baseFare: 320.0,
    transitSpeed: 'Heavy Highway Freight',
    estimatedTimeMins: 180,
    coldChainReady: true
  }
];

export const AVAILABLE_DRIVERS_AND_VEHICLES: AvailableDriverVehicle[] = [
  // 🚚 Tempo / EV Mini Trucks (Ideal for standard to bulk batches)
  {
    id: 'drv-tempo-1',
    driverName: 'Sunil Pawar',
    driverPhone: '+91 98234 77120',
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.9,
    driverTrips: 428,
    driverBadge: 'Refrigerated Cold-Chain Pro',
    isVerified: true,
    vehicleType: 'tempo',
    vehicleTypeName: 'Refrigerated EV Mini Truck',
    vehicleModel: 'Tata Ace EV Insulated Reefer',
    vehiclePlateNumber: 'MH-14-EA-9912',
    capacityLimitKg: 600,
    capacityLabel: 'Up to 600 kg (10-35 Crates)',
    ratePerKm: 9.5,
    estimatedDeliveryCost: 125.0,
    etaMins: 75,
    coldChainReady: true,
    proximityKm: 2.1,
    currentHub: 'Khed Farm Gate Agro Outpost',
    features: ['14.2°C Cold Chamber Active', 'Digital Weighing Scale', 'Zero Middlemen Transit']
  },
  {
    id: 'drv-tempo-2',
    driverName: 'Dnyaneshwar Patil',
    driverPhone: '+91 98902 44118',
    driverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.85,
    driverTrips: 376,
    driverBadge: 'Verified Agri Carrier',
    isVerified: true,
    vehicleType: 'tempo',
    vehicleTypeName: 'Ventilated Bulk Tempo',
    vehicleModel: 'Ashok Leyland Dost+ Hi-Volume',
    vehiclePlateNumber: 'MH-12-TK-5520',
    capacityLimitKg: 850,
    capacityLabel: 'Up to 850 kg (Up to 45 Crates/Bags)',
    ratePerKm: 10.5,
    estimatedDeliveryCost: 140.0,
    etaMins: 80,
    coldChainReady: false,
    proximityKm: 3.4,
    currentHub: 'Chakan Bypass Logistics Park',
    features: ['Heavy Weather Canvas Shield', 'Cushioned Shock Absorbers', 'Direct Farm Gate Loading']
  },

  // 🛺 3-Wheeler / Cargo Auto (Ideal for medium family & household orders)
  {
    id: 'drv-3w-1',
    driverName: 'Rameshwar Jadhav',
    driverPhone: '+91 94231 88921',
    driverPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.8,
    driverTrips: 312,
    driverBadge: 'Express Eco-Cargo Auto',
    isVerified: true,
    vehicleType: '3-wheeler',
    vehicleTypeName: 'Cargo Auto (EV)',
    vehicleModel: 'Mahindra Zor Grand Cargo EV',
    vehiclePlateNumber: 'MH-15-TC-3382',
    capacityLimitKg: 150,
    capacityLabel: 'Up to 150 kg (4-8 Crates)',
    ratePerKm: 5.5,
    estimatedDeliveryCost: 65.0,
    etaMins: 55,
    coldChainReady: false,
    proximityKm: 1.8,
    currentHub: 'Rajgurunagar Agro Point',
    features: ['Zero Tailpipe Emission EV', 'Covered Dust-Free Box', 'Fast Maneuverability']
  },
  {
    id: 'drv-3w-2',
    driverName: 'Santosh More',
    driverPhone: '+91 97654 33029',
    driverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.75,
    driverTrips: 245,
    driverBadge: 'Local Rural Transporter',
    isVerified: true,
    vehicleType: '3-wheeler',
    vehicleTypeName: 'Covered High-Deck Auto',
    vehicleModel: 'Piaggio Ape E-City Cargo',
    vehiclePlateNumber: 'MH-12-PQ-8841',
    capacityLimitKg: 200,
    capacityLabel: 'Up to 200 kg (6-10 Crates)',
    ratePerKm: 6.0,
    estimatedDeliveryCost: 75.0,
    etaMins: 60,
    coldChainReady: false,
    proximityKm: 2.9,
    currentHub: 'Alandi Rural Junction',
    features: ['Reinforced High Deck', 'Secure Latching Tarpaulin', 'Gentle Handling for Soft Produce']
  },

  // 🛵 2-Wheeler Express (Best for quick urgent single items & small baskets)
  {
    id: 'drv-2w-1',
    driverName: 'Mahesh Gaikwad',
    driverPhone: '+91 98811 44230',
    driverPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.95,
    driverTrips: 520,
    driverBadge: 'Superfast Express Rider',
    isVerified: true,
    vehicleType: '2-wheeler',
    vehicleTypeName: 'Electric Cargo Bike',
    vehicleModel: 'Hero Electric Nyx Dual-Battery Cargo',
    vehiclePlateNumber: 'MH-12-AZ-4109',
    capacityLimitKg: 20,
    capacityLabel: 'Up to 20 kg (1-2 Baskets)',
    ratePerKm: 3.0,
    estimatedDeliveryCost: 35.0,
    etaMins: 35,
    coldChainReady: false,
    proximityKm: 0.9,
    currentHub: 'Khed Town Center Stand',
    features: ['Direct Rapid Dispatch', 'Thermal Insulated Saddlebag', 'Ideal for Urgent Veggies & Herbs']
  },
  {
    id: 'drv-2w-2',
    driverName: 'Vikrant Shinde',
    driverPhone: '+91 91580 77211',
    driverPhoto: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.8,
    driverTrips: 290,
    driverBadge: 'Express Dew Harvest Courier',
    isVerified: true,
    vehicleType: '2-wheeler',
    vehicleTypeName: 'Heavy Duty 2-Wheeler',
    vehicleModel: 'TVS XL Heavy Duty i-Touch',
    vehiclePlateNumber: 'MH-14-BN-2041',
    capacityLimitKg: 30,
    capacityLabel: 'Up to 30 kg (1-2 Heavy Sacks)',
    ratePerKm: 3.5,
    estimatedDeliveryCost: 40.0,
    etaMins: 40,
    coldChainReady: false,
    proximityKm: 1.5,
    currentHub: 'Chakan Phata Link',
    features: ['Sturdy Rear Carrier Rack', 'Weatherproof Straps', 'Morning Dew Delivery Specialist']
  },

  // 🚛 Heavy Commercial Trucks (Best for bulk harvest, wholesale & community group buying)
  {
    id: 'drv-truck-1',
    driverName: 'Balwinder Singh',
    driverPhone: '+91 98140 22199',
    driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.9,
    driverTrips: 620,
    driverBadge: 'Commercial Highway Specialist',
    isVerified: true,
    vehicleType: 'truck',
    vehicleTypeName: 'Insulated Multi-Axle Truck',
    vehicleModel: 'Eicher Pro 2049 Insulated Highway Carrier',
    vehiclePlateNumber: 'MH-12-TR-8819',
    capacityLimitKg: 3500,
    capacityLabel: 'Up to 3,500 kg (Full Harvest Lots)',
    ratePerKm: 18.0,
    estimatedDeliveryCost: 320.0,
    etaMins: 110,
    coldChainReady: true,
    proximityKm: 4.5,
    currentHub: 'Talegaon Highway Agro Terminal',
    features: ['Ventilated Pallet Loading', 'Pneumatic Cushioning', 'Bulk Scale Seal Certified']
  },
  {
    id: 'drv-truck-2',
    driverName: 'Gurmukh Gill',
    driverPhone: '+91 98765 11088',
    driverPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    driverRating: 4.85,
    driverTrips: 490,
    driverBadge: 'Long-Haul Cold Chain Expert',
    isVerified: true,
    vehicleType: 'truck',
    vehicleTypeName: 'Active Refrigerated Heavy Reefer',
    vehicleModel: 'BharatBenz 1015R Reefer Heavy Truck',
    vehiclePlateNumber: 'MH-14-CL-7703',
    capacityLimitKg: 5000,
    capacityLabel: 'Up to 5,000 kg (Institutional / Co-op)',
    ratePerKm: 24.0,
    estimatedDeliveryCost: 450.0,
    etaMins: 130,
    coldChainReady: true,
    proximityKm: 5.2,
    currentHub: 'Pune-Nashik Highway Freight Yard',
    features: ['Active -2°C to 15°C Thermostat', 'Digital Temperature Logger', 'Hydraulic Lift-Gate Unloading']
  }
];

export const INITIAL_ORDERS: DirectOrder[] = [
  {
    id: 'AP-9042',
    orderNumber: 'AP-9042',
    buyerName: 'Priya Sharma',
    buyerLocation: 'Flat 402, Green Meadows, Baner, Pune',
    farmerName: 'Sardar Gurpreet Singh',
    farmLocation: 'Nashik Organic Valley (Plot #14, Khed)',
    placedAt: 'Today 07:30 AM',
    eta: 'Today 05:30 PM (In Transit)',
    status: 'In Transit',
    totalAmount: 919.5,
    farmerShare: 750.0,
    transitFee: 125.0,
    platformFee: 44.5,
    transportVehicle: 'tempo',
    vehicleDetails: {
      type: 'tempo',
      name: 'Tata Ace EV Refrigerated Van',
      plateNumber: 'MH-14-EA-9912',
      capacity: '800 kg / 45 Crates',
      temperatureControlled: true
    },
    driver: {
      name: 'Sunil Pawar',
      phone: '+91 98234 77120',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      tripsCount: 428,
      vehicleType: 'tempo',
      vehicleTypeName: 'Electric Cold-Chain Tempo (Tata Ace EV)',
      vehiclePlateNumber: 'MH-14-EA-9912',
      liveSpeedKmH: 48,
      chamberTempC: 14.2,
      batteryPercent: 82,
      statusMessage: 'On Pune-Nashik Expressway (NH-60), 16 km away'
    },
    currentMilestone: 'in_transit',
    distanceRemainingKm: 16,
    originHub: 'Khed Farm Plot #14, Nashik Hub',
    destinationHub: 'Baner Urban Hub, Pune',
    milestones: [
      {
        key: 'driver_assigned',
        title: 'Driver & Vehicle Assigned',
        hindiTitle: 'ड्राइवर व वाहन आवंटित',
        description: 'Sunil Pawar (EV Tempo #MH-14-EA-9912) assigned with pre-cooled cargo chamber',
        time: '07:45 AM',
        completed: true,
        current: false
      },
      {
        key: 'picked_up_farm',
        title: 'Picked up from Farm',
        hindiTitle: 'खेत से ताज़ा उठाया गया',
        description: 'Harvest weighed at farm gate (35.2 kg). Digital tamper-proof Agmark seal applied',
        time: '09:15 AM',
        completed: true,
        current: false
      },
      {
        key: 'in_transit',
        title: 'In Transit (Cold-Chain)',
        hindiTitle: 'रास्ते में (कोल्ड चेन)',
        description: 'Cruising via Expressway bypassing wholesale mandi yards at constant 14.2°C',
        time: '11:45 AM',
        completed: true,
        current: true
      },
      {
        key: 'out_for_delivery',
        title: 'Out for Delivery',
        hindiTitle: 'डिलीवरी के लिए निकला',
        description: 'Entering Baner-Balewadi locality for final doorstep handover',
        time: 'Est. 05:00 PM',
        completed: false,
        current: false
      },
      {
        key: 'delivered',
        title: 'Delivered to Doorstep',
        hindiTitle: 'सफलतापूर्वक पहुंचाया गया',
        description: 'Farm-fresh delivery completed with zero intermediary spoilage',
        time: 'Est. 05:30 PM',
        completed: false,
        current: false
      }
    ],
    items: [
      {
        name: 'Hybrid Roma Tomatoes (टमाटर)',
        quantity: 25,
        pricePerUnit: 28.5,
        unit: 'kg',
        total: 712.5,
        image: ASSETS.marketTomatoes
      },
      {
        name: 'Jyoti Table Potatoes (आलू)',
        quantity: 10,
        pricePerUnit: 18.0,
        unit: 'kg',
        total: 180.0,
        image: ASSETS.potatoesListing
      }
    ]
  },
  {
    id: 'AP-9018',
    orderNumber: 'AP-9018',
    buyerName: 'Amit Verma',
    buyerLocation: 'Nashik City Center',
    farmerName: 'Sardar Gurpreet Singh',
    farmLocation: 'Nashik Organic Valley (28 km away)',
    placedAt: 'Today 06:15 AM',
    eta: 'Today 03:00 PM (Farm Gate Plucked)',
    status: 'Picked up from Farm',
    totalAmount: 760.0,
    farmerShare: 638.0,
    transitFee: 65.0,
    platformFee: 37.0,
    transportVehicle: '3-wheeler',
    vehicleDetails: {
      type: '3-wheeler',
      name: 'Mahindra Zor Grand Cargo Auto',
      plateNumber: 'MH-15-TC-3382',
      capacity: '350 kg',
      temperatureControlled: false
    },
    driver: {
      name: 'Rameshwar Jadhav',
      phone: '+91 94231 88921',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      tripsCount: 312,
      vehicleType: '3-wheeler',
      vehicleTypeName: 'Cargo Auto (Mahindra Zor)',
      vehiclePlateNumber: 'MH-15-TC-3382',
      liveSpeedKmH: 36,
      batteryPercent: 74,
      statusMessage: 'Loading sun-dried grain sacks at farm gate'
    },
    currentMilestone: 'picked_up_farm',
    distanceRemainingKm: 26,
    originHub: 'Nashik Organic Valley',
    destinationHub: 'Nashik City Hub',
    milestones: [
      {
        key: 'driver_assigned',
        title: 'Driver & Vehicle Assigned',
        hindiTitle: 'ड्राइवर व वाहन आवंटित',
        description: 'Rameshwar Jadhav (Cargo Auto #MH-15-TC-3382) confirmed dispatch',
        time: '06:30 AM',
        completed: true,
        current: false
      },
      {
        key: 'picked_up_farm',
        title: 'Picked up from Farm',
        hindiTitle: 'खेत से उठाया गया',
        description: 'Sharbati wheat sacks checked for <11% moisture and loaded on cargo bed',
        time: '08:00 AM',
        completed: true,
        current: true
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        hindiTitle: 'रास्ते में',
        description: 'Direct transit route to Nashik City center',
        time: 'Est. 01:30 PM',
        completed: false,
        current: false
      },
      {
        key: 'out_for_delivery',
        title: 'Out for Delivery',
        hindiTitle: 'डिलीवरी के लिए निकला',
        description: 'Heading to recipient address',
        time: 'Est. 02:30 PM',
        completed: false,
        current: false
      },
      {
        key: 'delivered',
        title: 'Delivered to Doorstep',
        hindiTitle: 'सफलतापूर्वक पहुंचाया गया',
        description: 'Final grain delivery completed',
        time: 'Est. 03:00 PM',
        completed: false,
        current: false
      }
    ],
    items: [
      {
        name: 'Sharbati Golden Wheat (गेहूं 10kg Bags)',
        quantity: 2,
        pricePerUnit: 380.0,
        unit: 'bag',
        total: 760.0,
        image: ASSETS.marketWheat
      }
    ]
  },
  {
    id: 'AP-8829',
    orderNumber: 'AP-8829',
    buyerName: 'Green Basket Society',
    buyerLocation: 'Dadar West, Mumbai (Cooperative Housing)',
    farmerName: 'Sardar Gurpreet Singh',
    farmLocation: 'Nashik Organic Valley (Plot #14, Khed)',
    placedAt: 'Today 05:45 AM',
    eta: 'Today 06:00 PM (In Transit)',
    status: 'In Transit',
    totalAmount: 4570.0,
    farmerShare: 4275.0,
    transitFee: 210.0,
    platformFee: 85.0,
    transportVehicle: 'tempo',
    vehicleDetails: {
      type: 'tempo',
      name: 'Ashok Leyland Bada Dost EV Reefer',
      plateNumber: 'MH-14-BD-2041',
      capacity: '1,200 kg / 60 Crates',
      temperatureControlled: true
    },
    driver: {
      name: 'Dnyaneshwar Patil',
      phone: '+91 97654 33012',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 4.85,
      tripsCount: 385,
      vehicleType: 'tempo',
      vehicleTypeName: 'Bada Dost Reefer EV (Ashok Leyland)',
      vehiclePlateNumber: 'MH-14-BD-2041',
      liveSpeedKmH: 54,
      chamberTempC: 14.0,
      batteryPercent: 88,
      statusMessage: 'Cruising via Mumbai-Nashik Expressway • Pre-cooled 14.0°C'
    },
    currentMilestone: 'in_transit',
    distanceRemainingKm: 68,
    originHub: 'Khed Farm Plot #14, Nashik Hub',
    destinationHub: 'Dadar Bulk Distribution Center, Mumbai',
    milestones: [
      {
        key: 'driver_assigned',
        title: 'Transporter Allocated',
        hindiTitle: 'ट्रांसपोर्टर आवंटित',
        description: 'Dnyaneshwar Patil with Bada Dost EV Reefer locked',
        time: '06:00 AM',
        completed: true,
        current: false
      },
      {
        key: 'picked_up_farm',
        title: 'Farm Gate Loading Done',
        hindiTitle: 'खेत पर लोडिंग पूर्ण',
        description: '150 kg Roma Tomatoes loaded in 6 sanitized crates',
        time: '08:30 AM',
        completed: true,
        current: false
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        hindiTitle: 'मार्ग में (हाईवे)',
        description: 'En route to Mumbai via Igatpuri Ghats with constant cooling',
        time: 'Active',
        completed: true,
        current: true
      },
      {
        key: 'out_for_delivery',
        title: 'Out for Delivery',
        hindiTitle: 'वितरण के लिए तैयार',
        description: 'Local dispatch to Dadar West Society Gate',
        time: 'Est. 05:15 PM',
        completed: false,
        current: false
      },
      {
        key: 'delivered',
        title: 'Delivered',
        hindiTitle: 'वितरित',
        description: 'Delivered directly to cooperative store',
        time: 'Est. 06:00 PM',
        completed: false,
        current: false
      }
    ],
    items: [
      {
        name: 'Hybrid Roma Tomatoes (Grade A Crates)',
        quantity: 150,
        pricePerUnit: 28.5,
        unit: 'kg',
        total: 4275.0,
        image: ASSETS.tomatoesListing
      }
    ]
  },
  {
    id: 'AP-8790',
    orderNumber: 'AP-8790',
    buyerName: 'Dr. Rajesh Kulkarni',
    buyerLocation: 'Row House 12, Nyati Estate, Viman Nagar, Pune',
    farmerName: 'Sardar Gurpreet Singh',
    farmLocation: 'Nashik Organic Valley (Plot #14, Khed)',
    placedAt: 'Yesterday 08:30 AM',
    eta: 'Delivered (Yesterday 04:30 PM)',
    status: 'Delivered',
    totalAmount: 3130.0,
    farmerShare: 2950.0,
    transitFee: 120.0,
    platformFee: 60.0,
    transportVehicle: '3-wheeler',
    vehicleDetails: {
      type: '3-wheeler',
      name: 'Mahindra Zor Grand Cargo Auto',
      plateNumber: 'MH-15-TC-3382',
      capacity: '350 kg',
      temperatureControlled: false
    },
    driver: {
      name: 'Rameshwar Jadhav',
      phone: '+91 94231 88921',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      tripsCount: 312,
      vehicleType: '3-wheeler',
      vehicleTypeName: 'Cargo Auto (Mahindra Zor)',
      vehiclePlateNumber: 'MH-15-TC-3382',
      liveSpeedKmH: 0,
      batteryPercent: 92,
      statusMessage: 'Trip completed • Payment settled directly to farmer account'
    },
    currentMilestone: 'delivered',
    distanceRemainingKm: 0,
    originHub: 'Nashik Organic Valley',
    destinationHub: 'Viman Nagar, Pune',
    milestones: [
      {
        key: 'driver_assigned',
        title: 'Driver Assigned',
        hindiTitle: 'ड्राइवर आवंटित',
        description: 'Rameshwar Jadhav accepted booking',
        time: 'Yesterday 09:00 AM',
        completed: true,
        current: false
      },
      {
        key: 'picked_up_farm',
        title: 'Farm Gate Plucked & Packed',
        hindiTitle: 'खेत से उठाया गया',
        description: '35 kg Sharbati Wheat + 10 kg Malwa White Garlic verified',
        time: 'Yesterday 11:30 AM',
        completed: true,
        current: false
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        hindiTitle: 'मार्ग में',
        description: 'Fast corridor through Chakan bypass',
        time: 'Yesterday 02:00 PM',
        completed: true,
        current: false
      },
      {
        key: 'out_for_delivery',
        title: 'Out for Delivery',
        hindiTitle: 'वितरण जारी',
        description: 'Arrival at Viman Nagar gated society',
        time: 'Yesterday 04:00 PM',
        completed: true,
        current: false
      },
      {
        key: 'delivered',
        title: 'Handover Completed',
        hindiTitle: 'सफलतापूर्वक पहुंचाया गया',
        description: 'Verified by OTP: 8821 • 100% farm gate fresh handover',
        time: 'Yesterday 04:30 PM',
        completed: true,
        current: true
      }
    ],
    items: [
      {
        name: 'Sharbati Golden Wheat (गेहूं)',
        quantity: 35,
        pricePerUnit: 38.0,
        unit: 'kg',
        total: 1330.0,
        image: ASSETS.marketWheat
      },
      {
        name: 'Desi White Garlic Bulbs (लहसुन)',
        quantity: 10,
        pricePerUnit: 162.0,
        unit: 'kg',
        total: 1620.0,
        image: ASSETS.garlicListing
      }
    ]
  },
  {
    id: 'AP-8640',
    orderNumber: 'AP-8640',
    buyerName: 'FreshRoots Farm Kitchen & Cafe',
    buyerLocation: 'Lane 7, Koregaon Park, Pune (Commercial Bulk)',
    farmerName: 'Sardar Gurpreet Singh',
    farmLocation: 'Nashik Organic Valley (Plot #14, Khed)',
    placedAt: '02 Sep 07:00 AM',
    eta: 'Delivered (02 Sep 02:15 PM)',
    status: 'Delivered',
    totalAmount: 23150.0,
    farmerShare: 22560.0,
    transitFee: 390.0,
    platformFee: 200.0,
    transportVehicle: 'truck',
    vehicleDetails: {
      type: 'truck',
      name: 'Eicher Pro 2049 Insulated Highway Carrier',
      plateNumber: 'MH-12-TR-8819',
      capacity: '3,500 kg',
      temperatureControlled: true
    },
    driver: {
      name: 'Balwinder Singh',
      phone: '+91 98140 22199',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      tripsCount: 620,
      vehicleType: 'truck',
      vehicleTypeName: 'Eicher Pro Insulated Truck',
      vehiclePlateNumber: 'MH-12-TR-8819',
      liveSpeedKmH: 0,
      batteryPercent: 100,
      statusMessage: 'Batch delivered and signed by Head Chef • Zero damage'
    },
    currentMilestone: 'delivered',
    distanceRemainingKm: 0,
    originHub: 'Nashik Organic Valley',
    destinationHub: 'Koregaon Park Commercial Center, Pune',
    milestones: [
      {
        key: 'driver_assigned',
        title: 'Heavy Carrier Assigned',
        hindiTitle: 'कमर्शियल वाहन आवंटित',
        description: 'Balwinder Singh allocated for bulk commercial lot',
        time: '02 Sep 07:15 AM',
        completed: true,
        current: false
      },
      {
        key: 'picked_up_farm',
        title: 'Farm Gate Loading',
        hindiTitle: 'खेत पर लोडिंग',
        description: '80L Wood-churned mustard oil tins + 120 kg polyhouse capsicum loaded',
        time: '02 Sep 09:30 AM',
        completed: true,
        current: false
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        hindiTitle: 'मार्ग में',
        description: 'Heavy transit via Talegaon corridor',
        time: '02 Sep 12:00 PM',
        completed: true,
        current: false
      },
      {
        key: 'out_for_delivery',
        title: 'Out for Delivery',
        hindiTitle: 'डिलीवरी के लिए तैयार',
        description: 'Arrival at Koregaon Park kitchen loading bay',
        time: '02 Sep 01:45 PM',
        completed: true,
        current: false
      },
      {
        key: 'delivered',
        title: 'Delivered & Accepted',
        hindiTitle: 'सफलतापूर्वक पहुंचाया गया',
        description: 'Commercial invoice cleared via instant RTGS/UPI',
        time: '02 Sep 02:15 PM',
        completed: true,
        current: true
      }
    ],
    items: [
      {
        name: 'Pure Cold-Pressed Desi Mustard Oil',
        quantity: 80,
        pricePerUnit: 210.0,
        unit: 'Litre',
        total: 16800.0,
        image: ASSETS.mustardOil
      },
      {
        name: 'Crisp Green Capsicum (Polyhouse Grade A)',
        quantity: 120,
        pricePerUnit: 48.0,
        unit: 'kg',
        total: 5760.0,
        image: ASSETS.capsicumListing
      }
    ]
  }
];

// Region-Based Smart Recommendations & Insights Data
export const REGIONAL_INSIGHTS: Record<string, RegionalInsightData> = {
  maharashtra_nashik: {
    regionKey: 'maharashtra_nashik',
    regionName: 'Nashik & Pune Agri Belt',
    state: 'Maharashtra',
    district: 'Nashik',
    hubName: 'Nashik - Khed Shivapur Agro Hub',
    weather: {
      temperature: 26,
      condition: 'Light Monsoon Drizzle',
      conditionIcon: 'rainy',
      humidity: 78,
      rainfallChance: 65,
      windSpeedKm: 14,
      advisoryHeadline: 'Harvest Alert: Moderate showers forecasted within 18 hours',
      advisoryDetail: 'Pick ripe Roma tomatoes and green capsicum before 3:00 PM tomorrow to avoid skin cracking and fungal blemish. Favorable window for leafy greens harvesting is dawn.',
      optimalWindow: 'Tomorrow 05:30 AM – 11:30 AM',
      actionType: 'harvest_alert',
      hourlyForecast: [
        { time: '06:00', temp: '22°C', rainProb: 15, icon: 'cloud' },
        { time: '09:00', temp: '25°C', rainProb: 20, icon: 'partly_cloudy_day' },
        { time: '12:00', temp: '27°C', rainProb: 45, icon: 'cloud' },
        { time: '15:00', temp: '26°C', rainProb: 70, icon: 'rainy' },
        { time: '18:00', temp: '24°C', rainProb: 65, icon: 'thunderstorm' },
      ]
    },
    logistics: [
      {
        id: 'log-1',
        name: 'Maha-Kisan EV Cold Express (Route 4)',
        type: 'cold_chain_ev',
        route: 'Nashik Hub ➔ Kothrud / Baner Pune Urban Hubs',
        capacityAvailable: '1.8 Tons (180 crates)',
        departureTime: 'Today 06:30 PM (Daily)',
        rate: '₹3.20 / kg (Refrigerated 4°C)',
        phone: '+91 98224 55190',
        verifiedPartner: true,
        vehicleNumber: 'MH-15-EV-4122',
        temperatureZone: '4°C - 8°C Pre-Cooled',
        badge: 'Zero Emission EV'
      },
      {
        id: 'log-2',
        name: 'Nashik Sahyadri Multi-Chamber Agro Cold Hub',
        type: 'cold_storage',
        route: 'Nashik-Dindori Road (12 km from farm gate)',
        capacityAvailable: '420 Crates Available',
        departureTime: '24x7 Ingress / Digital Gate Pass',
        rate: '₹42 / crate / month (Humidity Controlled)',
        phone: '+91 94222 88301',
        verifiedPartner: true,
        temperatureZone: '3°C, 88% RH Sensor-Tracked',
        badge: 'NABARD Certified'
      },
      {
        id: 'log-3',
        name: 'Lasalgaon Direct Farmers Co-op Freight',
        type: 'cooperative_truck',
        route: 'Lasalgaon ➔ Vashi APMC Direct Terminal',
        capacityAvailable: '4.5 Tons Bulk Space',
        departureTime: 'Tonight 10:00 PM',
        rate: '₹1.90 / kg (Ventilated Bulk)',
        phone: '+91 98500 12390',
        verifiedPartner: true,
        vehicleNumber: 'MH-15-AJ-8901',
        badge: 'Co-op Direct'
      }
    ],
    trendingProduce: [
      {
        id: 'tr-1',
        cropName: 'Roma Field Tomatoes',
        regionalName: 'हायब्रिड लाल टोमॅटो',
        category: 'Vegetables',
        urbanDemandIndex: 42,
        annapurnaPrice: 28.5,
        mandiPrice: 19.0,
        unit: 'kg',
        bestHubMarket: 'Pune & Navi Mumbai',
        reason: 'Consumer demand +42% due to festive culinary demand and organic residue certification.',
        image: ASSETS.marketTomatoes,
        seasonTag: 'Peak Demand Window'
      },
      {
        id: 'tr-2',
        cropName: 'Lasalgaon Sun-Cured Red Onions',
        regionalName: 'लासलगाव लाल कांदा',
        category: 'Vegetables',
        urbanDemandIndex: 38,
        annapurnaPrice: 32.0,
        mandiPrice: 22.0,
        unit: 'kg',
        bestHubMarket: 'Mumbai Suburban Groups',
        reason: '55mm+ uniform grade fetching ₹10/kg direct premium over local mandi cartels.',
        image: ASSETS.onionsListing,
        seasonTag: 'Direct Bag Delivery'
      },
      {
        id: 'tr-3',
        cropName: 'Polyhouse Green Capsicum',
        regionalName: 'हिरवी ढोबळी मिरची',
        category: 'Vegetables',
        urbanDemandIndex: 48,
        annapurnaPrice: 48.0,
        mandiPrice: 30.0,
        unit: 'kg',
        bestHubMarket: 'Baner & Hinjawadi Tech Parks',
        reason: 'High retail spread in IT hubs; direct apartment society subscription orders surged.',
        image: ASSETS.capsicumListing,
        seasonTag: 'High Margin'
      }
    ]
  },
  punjab_ludhiana: {
    regionKey: 'punjab_ludhiana',
    regionName: 'Ludhiana & Malwa Grain Belt',
    state: 'Punjab',
    district: 'Ludhiana',
    hubName: 'Ludhiana Kisan Organic Hub',
    weather: {
      temperature: 31,
      condition: 'Sunny & Clear Skies',
      conditionIcon: 'wb_sunny',
      humidity: 38,
      rainfallChance: 5,
      windSpeedKm: 9,
      advisoryHeadline: 'Optimal Drying Window: Dry sunny weather ideal for post-harvest grains',
      advisoryDetail: 'Sun-drying for Sharbati wheat and mustard lots will achieve optimal storage moisture below 10.5%. Perfect 4-day window for grain aeration.',
      optimalWindow: 'Next 72 Hours (Zero Rain)',
      actionType: 'sowing_window',
      hourlyForecast: [
        { time: '06:00', temp: '24°C', rainProb: 0, icon: 'wb_sunny' },
        { time: '10:00', temp: '29°C', rainProb: 0, icon: 'wb_sunny' },
        { time: '14:00', temp: '33°C', rainProb: 5, icon: 'wb_sunny' },
        { time: '18:00', temp: '29°C', rainProb: 5, icon: 'partly_cloudy_day' },
        { time: '21:00', temp: '26°C', rainProb: 0, icon: 'clear_night' },
      ]
    },
    logistics: [
      {
        id: 'log-pb-1',
        name: 'Punjab Kisan Grain Line Express',
        type: 'refrigerated_van',
        route: 'Ludhiana ➔ Delhi NCR & Chandigarh Direct',
        capacityAvailable: '6 Tons (Grain Bags)',
        departureTime: 'Daily 08:00 PM',
        rate: '₹2.20 / kg (Bag Tagged)',
        phone: '+91 98140 33211',
        verifiedPartner: true,
        vehicleNumber: 'PB-10-CZ-7721',
        badge: 'Direct Mill Transit'
      },
      {
        id: 'log-pb-2',
        name: 'Ludhiana Modern Agro Silo Storage',
        type: 'cold_storage',
        route: 'GT Road Ludhiana (8 km from Mandi)',
        capacityAvailable: '12,000 Quintals Storage',
        departureTime: 'Continuous Ingress',
        rate: '₹28 / bag / month',
        phone: '+91 98720 99401',
        verifiedPartner: true,
        temperatureZone: 'Moisture Controlled <10%',
        badge: 'FSSAI Approved'
      }
    ],
    trendingProduce: [
      {
        id: 'tr-pb-1',
        cropName: 'Unpolished Sharbati Golden Wheat',
        regionalName: 'ਸ਼ਰਬਤੀ ਸੁਨਹਿਰੀ ਕਣਕ',
        category: 'Grains',
        urbanDemandIndex: 52,
        annapurnaPrice: 38.0,
        mandiPrice: 28.5,
        unit: 'kg',
        bestHubMarket: 'Delhi NCR & Gurgaon',
        reason: 'Direct grain bag orders from gated communities up 52% with zero polishing guarantee.',
        image: ASSETS.marketWheat,
        seasonTag: 'Bulk Grain Season'
      },
      {
        id: 'tr-pb-2',
        cropName: 'Wood-Churned Pure Mustard Oil',
        regionalName: 'ਕੋਹਲੂ ਦਾ ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ',
        category: 'Oils',
        urbanDemandIndex: 44,
        annapurnaPrice: 210.0,
        mandiPrice: 165.0,
        unit: 'Litre',
        bestHubMarket: 'Tricity Chandigarh & NCR',
        reason: 'Cold-pressed unrefined desi sarson in demand as urban families shift from refined oils.',
        image: ASSETS.mustardOil,
        seasonTag: 'High Value'
      }
    ]
  },
  andhra_guntur: {
    regionKey: 'andhra_guntur',
    regionName: 'Guntur & Krishna Spice Corridor',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    hubName: 'Guntur Organic Spices Hub',
    weather: {
      temperature: 29,
      condition: 'Tropical Humid & Gentle Wind',
      conditionIcon: 'partly_cloudy_day',
      humidity: 74,
      rainfallChance: 25,
      windSpeedKm: 12,
      advisoryHeadline: 'Sowing Advisory: Soil temperature (28°C) optimal for chilli rhizome plantation',
      advisoryDetail: 'Maintain drip irrigation in early morning hours. Organic neem cake treatment recommended prior to seed transplantation.',
      optimalWindow: 'Immediate 5-Day Window',
      actionType: 'sowing_window',
      hourlyForecast: [
        { time: '06:00', temp: '25°C', rainProb: 10, icon: 'partly_cloudy_day' },
        { time: '11:00', temp: '30°C', rainProb: 20, icon: 'wb_sunny' },
        { time: '15:00', temp: '31°C', rainProb: 30, icon: 'cloud' },
        { time: '19:00', temp: '28°C', rainProb: 20, icon: 'partly_cloudy_day' },
      ]
    },
    logistics: [
      {
        id: 'log-ap-1',
        name: 'Deccan Spice Cold Express',
        type: 'cold_chain_ev',
        route: 'Guntur ➔ Hyderabad Gachibowli Organic Hub',
        capacityAvailable: '2.4 Tons Spice Cargo',
        departureTime: 'Daily 07:00 PM',
        rate: '₹3.80 / kg (Aroma Sealed)',
        phone: '+91 98480 77122',
        verifiedPartner: true,
        vehicleNumber: 'AP-07-TJ-9932',
        badge: 'Spice Guard Van'
      }
    ],
    trendingProduce: [
      {
        id: 'tr-ap-1',
        cropName: 'Guntur Sannam S4 Dry Chillies',
        regionalName: 'గుంటూరు సన్నం ఎండిన మిర్చి',
        category: 'Spices',
        urbanDemandIndex: 58,
        annapurnaPrice: 220.0,
        mandiPrice: 165.0,
        unit: 'kg',
        bestHubMarket: 'Hyderabad & Bengaluru',
        reason: 'Sun-dried high capsaicin organic chillies trending up 58% in direct urban baskets.',
        image: ASSETS.chilliListing,
        seasonTag: 'Premium Spice'
      }
    ]
  },
  mp_indore: {
    regionKey: 'mp_indore',
    regionName: 'Malwa Agro Plateau',
    state: 'Madhya Pradesh',
    district: 'Indore',
    hubName: 'Indore Malwa Kisan Hub',
    weather: {
      temperature: 27,
      condition: 'Pleasant & Moderate Breeze',
      conditionIcon: 'air',
      humidity: 55,
      rainfallChance: 15,
      windSpeedKm: 16,
      advisoryHeadline: 'Favorable Weather: Ideal moisture balance for garlic & onion shade-curing',
      advisoryDetail: 'Ensure shade ventilation on curing racks. Prevents fungal neck rot while preserving natural allicin pungency.',
      optimalWindow: 'Next 5 Days',
      actionType: 'favorable',
      hourlyForecast: [
        { time: '06:00', temp: '21°C', rainProb: 5, icon: 'wb_sunny' },
        { time: '12:00', temp: '28°C', rainProb: 15, icon: 'partly_cloudy_day' },
        { time: '17:00', temp: '26°C', rainProb: 10, icon: 'air' },
      ]
    },
    logistics: [
      {
        id: 'log-mp-1',
        name: 'Malwa Agro Highway Fleet',
        type: 'refrigerated_van',
        route: 'Indore ➔ Ahmedabad & Mumbai Direct Corridor',
        capacityAvailable: '3.2 Tons',
        departureTime: 'Alternate Days 05:00 PM',
        rate: '₹2.80 / kg',
        phone: '+91 94250 11980',
        verifiedPartner: true,
        vehicleNumber: 'MP-09-GE-5510',
        badge: 'Express Corridor'
      }
    ],
    trendingProduce: [
      {
        id: 'tr-mp-1',
        cropName: 'Desi Malwa White Garlic',
        regionalName: 'मालवा देशी सफेद लहसुन',
        category: 'Vegetables',
        urbanDemandIndex: 46,
        annapurnaPrice: 180.0,
        mandiPrice: 125.0,
        unit: 'kg',
        bestHubMarket: 'Mumbai & Pune',
        reason: 'Large unpeeled desi garlic cloves with intense fragrance in high urban demand.',
        image: ASSETS.garlicListing,
        seasonTag: 'Medicinal Grade'
      }
    ]
  },
  up_agra: {
    regionKey: 'up_agra',
    regionName: 'Braj & Yamuna Agri Valley',
    state: 'Uttar Pradesh',
    district: 'Agra',
    hubName: 'Agra Cold Hub & Mandi Link',
    weather: {
      temperature: 28,
      condition: 'Partly Cloudy with Calm Winds',
      conditionIcon: 'cloud',
      humidity: 62,
      rainfallChance: 20,
      windSpeedKm: 10,
      advisoryHeadline: 'Cold Chain Advisory: Dispatch refrigerated potato lots during cool evening windows',
      advisoryDetail: 'Pre-cool loading reduces condensation shock when shipping to Delhi NCR supermarkets.',
      optimalWindow: 'Daily Evening 07:00 PM – 11:00 PM',
      actionType: 'favorable',
      hourlyForecast: [
        { time: '07:00', temp: '23°C', rainProb: 10, icon: 'cloud' },
        { time: '13:00', temp: '29°C', rainProb: 20, icon: 'partly_cloudy_day' },
        { time: '19:00', temp: '26°C', rainProb: 15, icon: 'cloud' },
      ]
    },
    logistics: [
      {
        id: 'log-up-1',
        name: 'Yamuna Expressway Cold Carrier',
        type: 'cold_chain_ev',
        route: 'Agra Cold Hub ➔ Noida / Greater Noida / Delhi NCR',
        capacityAvailable: '5.0 Tons',
        departureTime: 'Daily 09:00 PM',
        rate: '₹1.80 / kg',
        phone: '+91 94122 66019',
        verifiedPartner: true,
        vehicleNumber: 'UP-80-EV-2090',
        badge: 'Express Highway Fleet'
      }
    ],
    trendingProduce: [
      {
        id: 'tr-up-1',
        cropName: 'Jyoti Table Potatoes (Grade A)',
        regionalName: 'ज्योति आलू (ग्रेड-ए)',
        category: 'Vegetables',
        urbanDemandIndex: 35,
        annapurnaPrice: 18.0,
        mandiPrice: 12.5,
        unit: 'kg',
        bestHubMarket: 'Delhi NCR Supermarkets',
        reason: 'High solids content, certified zero sprout-inhibitor chemical residue.',
        image: ASSETS.potatoesListing,
        seasonTag: 'Steady Demand'
      }
    ]
  }
};

export const REGION_SELECT_OPTIONS = [
  {
    state: 'Maharashtra',
    districts: ['Nashik', 'Pune', 'Lasalgaon', 'Sangli', 'Nagpur'],
    defaultKey: 'maharashtra_nashik'
  },
  {
    state: 'Punjab',
    districts: ['Ludhiana', 'Amritsar', 'Sangrur', 'Jalandhar', 'Bathinda'],
    defaultKey: 'punjab_ludhiana'
  },
  {
    state: 'Andhra Pradesh',
    districts: ['Guntur', 'Krishna', 'Vijayawada', 'Kurnool'],
    defaultKey: 'andhra_guntur'
  },
  {
    state: 'Madhya Pradesh',
    districts: ['Indore', 'Ujjain', 'Dewas', 'Bhopal'],
    defaultKey: 'mp_indore'
  },
  {
    state: 'Uttar Pradesh',
    districts: ['Agra', 'Varanasi', 'Meerut', 'Aligarh'],
    defaultKey: 'up_agra'
  }
];

export function getRegionalInsight(state: string, district?: string): RegionalInsightData {
  const normState = state.toLowerCase();
  if (normState.includes('punjab')) {
    return REGIONAL_INSIGHTS['punjab_ludhiana'];
  }
  if (normState.includes('andhra') || normState.includes('telangana')) {
    return REGIONAL_INSIGHTS['andhra_guntur'];
  }
  if (normState.includes('madhya') || normState.includes('mp')) {
    return REGIONAL_INSIGHTS['mp_indore'];
  }
  if (normState.includes('uttar') || normState.includes('up')) {
    return REGIONAL_INSIGHTS['up_agra'];
  }
  // Default to Maharashtra (Nashik/Pune)
  return REGIONAL_INSIGHTS['maharashtra_nashik'];
}
