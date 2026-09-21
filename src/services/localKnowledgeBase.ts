import { RagKnowledgeDoc } from '../types';

export const LOCAL_KNOWLEDGE_REPOSITORY: RagKnowledgeDoc[] = [
  // 1. Regional Farming & Agronomy Guides
  {
    id: 'kb-farm-01',
    referenceCode: 'AG-MH-01',
    category: 'farming_guide',
    region: 'Maharashtra (Nashik, Pune, Ahmednagar)',
    title: 'Natural Pest Mitigation for Tomatoes & Vegetables (Neemastra & Agniastra)',
    tags: ['pest', 'tomatoes', 'organic', 'neem', 'leaf curl', 'whitefly', 'natural spray'],
    content: `For tomato leaf curl virus and sucking pests (whiteflies, thrips, aphids), synthetic chemical sprays cause residue buildup and buyer rejections. 
Recommended Organic Solution:
1. Neemastra Formulation: 5 kg fresh Neem leaves crushed in 5 liters Desi cow urine + 2 kg cow dung in 100 liters water. Ferment for 48 hours in shade. Filter through muslin cloth and spray at 10% dilution every 10 days.
2. Agniastra Formulation for heavy caterpillar/fruit borer infestation: 500g crushed green chillies, 500g garlic paste, 250g tobacco leaves or crushed neem seeds boiled in 5L cow urine until reduced to half. Dilute 2L in 100L water.
Safe harvest interval: 0 days (100% organic Agmark compliant).`
  },
  {
    id: 'kb-farm-02',
    referenceCode: 'AG-MP-02',
    category: 'farming_guide',
    region: 'Madhya Pradesh & Malwa Belt',
    title: 'Desi Garlic & Onion Post-Harvest Curing & Pungency Retention',
    tags: ['garlic', 'onion', 'curing', 'storage', 'allicin', 'post-harvest', 'spoilage'],
    content: `Malwa Desi Garlic bulbs require strict post-harvest shade curing to maximize allicin content and eliminate fungal neck rot:
1. Never sun-dry cured garlic directly on asphalt or metal sheets above 35°C as it destroys active allicin oil.
2. Cure for 18-21 days on raised bamboo racks in well-ventilated shade with continuous cross-ventilation.
3. Trim tops leaving 2.5 cm neck once the pseudostem is completely dry and paper skin rustles.
4. Storage: Maintain 65-70% relative humidity. Avoid plastic bags; use breathable jute or aerated mesh crates to prevent premature sprouting.`
  },
  {
    id: 'kb-farm-03',
    referenceCode: 'AG-PB-03',
    category: 'farming_guide',
    region: 'Punjab & North India',
    title: 'Sharbati Wheat Storage & Organic Weevil Prevention (<11% Moisture)',
    tags: ['wheat', 'sharbati', 'grain', 'moisture', 'weevil', 'storage', 'silos'],
    content: `Sharbati Golden Wheat achieves premium direct-to-consumer pricing only if grain moisture remains strictly below 11%:
1. High moisture (>12.5%) triggers khapra beetle and grain weevil emergence within 3 weeks.
2. Solar moisture testing: Grain should break with a sharp clean snapping sound when bitten between teeth, not feel gummy.
3. Organic weevil repellant: Mix 50g dried neem leaves and 10g turmeric powder per 10kg grain bag before hermetic sealing.
4. Keep bags elevated on wooden pallets 15cm above concrete floors to eliminate capillary ground moisture absorption.`
  },
  {
    id: 'kb-farm-04',
    referenceCode: 'AG-MH-04',
    category: 'farming_guide',
    region: 'Deccan & Western India',
    title: 'Soil Health & In-Situ Green Manuring (Dhaincha & Sunnhemp)',
    tags: ['soil', 'organic matter', 'green manure', 'dhaincha', 'sunnhemp', 'nitrogen'],
    content: `To cut synthetic urea dependence by 40-60%:
1. Sow Dhaincha (Sesbania aculeata) or Sunnhemp at 20-25 kg seed/acre immediately following summer harvest.
2. Incorporate biomass into soil at 45-50 days when succulent flowering begins, using a rotavator or disc plough.
3. Adds 80-100 kg biological Nitrogen per hectare and 15-20 tonnes of green organic humus, elevating soil microbial biodiversity.`
  },

  // 2. Weather & Crop Advisory Data
  {
    id: 'kb-wth-01',
    referenceCode: 'WX-ADV-01',
    category: 'weather_advisory',
    region: 'Pan-India',
    title: 'Pre-Harvest Heavy Rain & Monsoon Drainage Trench Protocol',
    tags: ['rain', 'monsoon', 'drainage', 'waterlogging', 'root rot', 'weather', 'flood'],
    content: `When rainfall probability exceeds 65% within 48 hours:
1. Pause all foliar nutrient and organic bio-fungicide sprays to prevent wasteful runoff wash.
2. Cut perimeter surface drainage trenches (30cm depth x 40cm width) along field slopes to prevent root-zone water stagnation.
3. If tomatoes or capsicums are 85% mature (breaker stage), accelerate harvest before rain to eliminate fruit cracking and fungal skin blight.
4. Harvested crates must immediately be moved to covered dry threshing sheds on plastic tarpaulins.`
  },
  {
    id: 'kb-wth-02',
    referenceCode: 'WX-ADV-02',
    category: 'weather_advisory',
    region: 'Northern & Central Plains',
    title: 'Winter Frost & Cold-Wave Mitigation for Nightshade Crops',
    tags: ['frost', 'winter', 'cold wave', 'temperature', 'sprinkler', 'mulching'],
    content: `When nighttime ground temperatures dip below 4°C:
1. Nightshade vegetables (tomatoes, potatoes, brinjals) suffer cellular freezing causing sudden leaf blackening.
2. Apply light evening micro-irrigation or sprinkler misting between 4:00 AM and 6:00 AM; water freezing releases latent heat protecting canopy foliage.
3. Organic paddy straw mulching along plant beds retains root soil temperature 2-3°C higher than bare ground.`
  },

  // 3. Transport & Cold-Chain Logistics FAQs
  {
    id: 'kb-trn-01',
    referenceCode: 'CC-STD-01',
    category: 'transport_faq',
    region: 'Logistics Corridors (Urban Farm-Gate Routes)',
    title: 'Direct Farm-to-Doorstep Cold-Chain Temperature Standards',
    tags: ['cold chain', 'temperature', 'reefer', 'tomatoes', 'mustard oil', 'greens', 'spoilage'],
    content: `Approved Annapurna Cold-Chain transit standards:
1. Ripe Table Tomatoes & Bell Peppers: Maintain cargo chamber strictly at 12°C to 15°C. Lower temperatures (<10°C) cause chilling injury, loss of aroma and mealy texture.
2. Leafy Greens, Coriander & Fresh Herbs: Maintain 4°C to 7°C with high relative humidity (>90%).
3. Stored Jyoti Potatoes & Onions: Ambient ventilated dry transit (16°C - 20°C). Do NOT put in freezing cold storage without prior conditioning.
4. Pure Cold-Pressed Oils: 18°C - 24°C out of direct sun.`
  },
  {
    id: 'kb-trn-02',
    referenceCode: 'TR-CAP-02',
    category: 'transport_faq',
    region: 'Pan-India Carrier Fleet',
    title: 'Transport Vehicle Capacity Limits & Crate Packaging Rules',
    tags: ['vehicle', 'capacity', '2-wheeler', '3-wheeler', 'tempo', 'truck', 'payload', 'crate'],
    content: `Vehicle selection guidelines for farm dispatches:
- 2-Wheeler Express: Up to 15 kg (1-2 crates). For urgent leafy greens, single bags, herbs.
- 3-Wheeler / Auto Cargo (Mahindra Zor / Piaggio): 15 kg to 80 kg (3-6 crates). Max capacity 350kg for short city runs.
- EV Mini Truck / Tempo (Tata Ace EV / Bada Dost): 80 kg to 600 kg (10-35 standard crates). Features active 14°C cold chamber.
- Heavy Commercial Truck (Eicher Pro / BharatBenz): 500 kg to 3,500+ kg for wholesale farm gate bulk lots.
All produce crates must be plastic perforated, stackable up to 5 tiers, and secured with Agmark tamper-proof tie bands.`
  },
  {
    id: 'kb-trn-03',
    referenceCode: 'TR-PAY-03',
    category: 'transport_faq',
    region: 'Financial & Settlement System',
    title: 'Zero Middleman Direct Payouts & Transit Verification',
    tags: ['payout', 'middlemen', 'settlement', 'upi', 'escrow', 'commission', 'bank'],
    content: `How Annapurna direct settlement works:
1. 100% of the produce value listed goes directly to the farmer. Zero APMC mandi deductions, zero middleman commission (saving 12-18% typically lost at traditional mandis).
2. The buyer pays for produce + transit carrier fee directly via digital escrow.
3. Upon driver doorstep handover verified by customer OTP, funds are instantly released to the farmer's linked bank account / UPI via automated settlement.
4. Transit passes and Agmark barcodes guarantee proof of origin and eliminate highway checkpoint harassment.`
  },

  // 4. Mandi Price Benchmarks & Negotiation Reference
  {
    id: 'kb-mnd-01',
    referenceCode: 'MD-REF-01',
    category: 'mandi_reference',
    region: 'National APMC & Direct Hubs',
    title: 'How Mandi Benchmark Rates Are Derived and Farm-Gate Premiums',
    tags: ['mandi', 'rates', 'apmc', 'pricing', 'fair price', 'market rate', 'premium'],
    content: `Mandi benchmark rates represent the daily modal wholesale price recorded at district APMC yards. 
Under the direct Annapurna model:
- Farmers earn 15% to 35% above the modal Mandi wholesale rate because consumers bypass wholesaler, commission agent (arhatiya), and retail markup layers.
- Consumers simultaneously pay 15% to 25% below hyper-inflated urban retail supermarket prices while receiving harvest plucked within 12 hours.`
  }
];
