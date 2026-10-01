export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  issuerType: 'Private Bank' | 'NBFC';
  category: 'Cashback' | 'Travel & Lounge' | 'Lifetime Free' | 'Rewards' | 'UPI / RuPay';
  joiningFee: number;
  annualFee: number;
  feeWaiverText: string;
  rating: number;
  rewardRate: string;
  keyPerks: string[];
  gradient: string;
  network: 'RuPay' | 'Visa' | 'Mastercard';
  applyUrl: string;
  popularBadge?: string;
}

export const CREDIT_CARDS: CreditCard[] = [
  {
    id: 'hdfc-millennia',
    name: 'HDFC Millennia Credit Card',
    issuer: 'HDFC Bank',
    issuerType: 'Private Bank',
    category: 'Cashback',
    joiningFee: 1000,
    annualFee: 1000,
    feeWaiverText: 'Waived on ₹1 Lakh annual spend',
    rating: 4.8,
    rewardRate: '5% Cashback on Amazon, Flipkart, Swiggy & Zomato',
    keyPerks: ['1% cashback on offline spends', '4 complimentary lounge visits/year', '1% fuel surcharge waiver'],
    gradient: 'from-blue-700 to-indigo-900',
    network: 'Visa',
    applyUrl: '#apply',
    popularBadge: 'Most Popular'
  },
  {
    id: 'icici-amazon-pay',
    name: 'Amazon Pay ICICI Bank Credit Card',
    issuer: 'ICICI Bank',
    issuerType: 'Private Bank',
    category: 'Lifetime Free',
    joiningFee: 0,
    annualFee: 0,
    feeWaiverText: 'Lifetime Free (Zero Annual Charges)',
    rating: 4.9,
    rewardRate: '5% Unlimited Cashback for Prime Members',
    keyPerks: ['No minimum redemption limit', 'Direct statement/wallet credit', 'No joining or renewal fee forever'],
    gradient: 'from-amber-600 to-orange-800',
    network: 'Visa',
    applyUrl: '#apply',
    popularBadge: 'Zero Annual Fee'
  },
  {
    id: 'axis-airtel',
    name: 'Airtel Axis Bank Credit Card',
    issuer: 'Axis Bank',
    issuerType: 'Private Bank',
    category: 'Cashback',
    joiningFee: 500,
    annualFee: 500,
    feeWaiverText: 'Waived on ₹2 Lakh annual spend',
    rating: 4.7,
    rewardRate: '25% Cashback on Airtel Bills & Recharge',
    keyPerks: ['10% cashback on Swiggy, Zomato & BigBasket', '10% on utility bill payments (Electricity/Gas)', '4 domestic airport lounges/year'],
    gradient: 'from-rose-700 to-red-900',
    network: 'Mastercard',
    applyUrl: '#apply'
  },
  {
    id: 'idfc-first-select',
    name: 'IDFC FIRST Select Credit Card',
    issuer: 'IDFC FIRST Bank',
    issuerType: 'Private Bank',
    category: 'Lifetime Free',
    joiningFee: 0,
    annualFee: 0,
    feeWaiverText: 'Unconditional Lifetime Free',
    rating: 4.6,
    rewardRate: 'Up to 10X Reward Points (Never Expire)',
    keyPerks: ['Low interest APR starting from 9% p.a.', '4 complimentary domestic lounge visits/quarter', 'Buy 1 Get 1 Free movie ticket on Paytm'],
    gradient: 'from-purple-800 to-slate-900',
    network: 'Visa',
    applyUrl: '#apply'
  },
  {
    id: 'tata-neu-infinity',
    name: 'Tata Neu Infinity HDFC Bank RuPay',
    issuer: 'HDFC Bank',
    issuerType: 'Private Bank',
    category: 'UPI / RuPay',
    joiningFee: 1499,
    annualFee: 1499,
    feeWaiverText: 'Waived on ₹3 Lakh annual spend',
    rating: 4.7,
    rewardRate: '1.5% NeuCoins on UPI Payments',
    keyPerks: ['10% NeuCoins across Tata ecosystem (Tata CliQ, BigBasket, 1mg)', '8 domestic & 4 international lounge visits', 'Seamless UPI Scan & Pay via credit limit'],
    gradient: 'from-zinc-900 to-stone-900',
    network: 'RuPay',
    applyUrl: '#apply',
    popularBadge: 'Best for UPI'
  },
  {
    id: 'kotak-league',
    name: 'Kotak League Platinum Credit Card',
    issuer: 'Kotak Mahindra Bank',
    issuerType: 'Private Bank',
    category: 'Rewards',
    joiningFee: 500,
    annualFee: 500,
    feeWaiverText: 'Waived on ₹50,000 annual spend',
    rating: 4.4,
    rewardRate: 'Up to 8X Reward Points on Special Categories',
    keyPerks: ['Movie ticket vouchers on quarterly milestone spends', 'Fuel surcharge waiver across all pumps', 'Contactless tap & pay capability'],
    gradient: 'from-red-800 to-slate-900',
    network: 'Visa',
    applyUrl: '#apply'
  },
  {
    id: 'onecard-metal',
    name: 'OneCard Metal Credit Card',
    issuer: 'FPL Technologies (SBM/Federal/NBFC)',
    issuerType: 'NBFC',
    category: 'Lifetime Free',
    joiningFee: 0,
    annualFee: 0,
    feeWaiverText: 'Lifetime Free Metal Card',
    rating: 4.8,
    rewardRate: '5X Reward Points on Top 2 Spend Categories',
    keyPerks: ['Zero forex markup fee on promotions', 'Instant virtual card generation in app', 'Fractional rewards with zero expiry'],
    gradient: 'from-neutral-900 to-slate-800',
    network: 'Visa',
    applyUrl: '#apply',
    popularBadge: 'Metal Card'
  },
  {
    id: 'indusind-legend',
    name: 'IndusInd Bank Legend Credit Card',
    issuer: 'IndusInd Bank',
    issuerType: 'Private Bank',
    category: 'Travel & Lounge',
    joiningFee: 0,
    annualFee: 0,
    feeWaiverText: 'Zero Annual Fee (Special Promo)',
    rating: 4.5,
    rewardRate: '1 Reward Point per ₹100 on Weekdays, 2X on Weekends',
    keyPerks: ['1 complimentary domestic lounge visit per quarter', 'Buy 1 Get 1 on BookMyShow (1 free ticket/month)', 'Comprehensive travel insurance cover'],
    gradient: 'from-cyan-900 to-blue-950',
    network: 'Mastercard',
    applyUrl: '#apply'
  }
];