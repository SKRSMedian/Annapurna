import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { Language, UserProfile, FarmerVerificationDetails } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../utils/translations';

interface OnboardingAuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialStep?: 'language' | 'auth' | 'profile' | 'verification';
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onShowToast: (title: string, sub?: string) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const REGION_SELECT_OPTIONS = [
  {
    state: 'Maharashtra',
    districts: ['Nashik', 'Pune', 'Lasalgaon', 'Ahmednagar', 'Solapur', 'Nagpur']
  },
  {
    state: 'Punjab',
    districts: ['Ludhiana', 'Amritsar', 'Bathinda', 'Jalandhar', 'Patiala']
  },
  {
    state: 'Andhra Pradesh',
    districts: ['Guntur', 'Kurnool', 'Vijayawada', 'Krishna', 'Visakhapatnam']
  },
  {
    state: 'Telangana',
    districts: ['Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Hyderabad']
  },
  {
    state: 'Madhya Pradesh',
    districts: ['Indore', 'Ujjain', 'Hoshangabad', 'Bhopal', 'Ratlam']
  },
  {
    state: 'Uttar Pradesh',
    districts: ['Varanasi', 'Agra', 'Meerut', 'Prayagraj', 'Lucknow']
  }
];

export const OnboardingAuthModal: React.FC<OnboardingAuthModalProps> = ({
  isOpen,
  onClose,
  initialStep = 'language',
  currentProfile,
  onSaveProfile,
  currentLanguage,
  onSelectLanguage,
  onShowToast,
  isAuthenticated = false,
  onLogout
}) => {
  // Wizard Steps: 1: 'language' -> 2: 'auth' -> 3: 'profile' -> 4: 'verification' (for farmers)
  const [step, setStep] = useState<'language' | 'auth' | 'profile' | 'verification'>(initialStep);

  // Form State
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);
  const [isLangConfirmed, setIsLangConfirmed] = useState(false);

  const [phone, setPhone] = useState(currentProfile.phone || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isOtpVerified, setIsOtpVerified] = useState(Boolean(currentProfile.phone && isAuthenticated));

  // Profile Details State
  const [role, setRole] = useState<'farmer' | 'consumer'>(currentProfile.role || 'farmer');
  const [name, setName] = useState(currentProfile.name || '');
  const [state, setState] = useState(currentProfile.state || '');
  const [district, setDistrict] = useState(currentProfile.district || '');
  const [farmName, setFarmName] = useState(currentProfile.farmName || '');
  const [farmSize, setFarmSize] = useState<string | number>(
    currentProfile.farmSizeAcres !== undefined ? currentProfile.farmSizeAcres : ''
  );

  // Farmer Verification State
  const [verificationDocType, setVerificationDocType] = useState<'pm_kisan' | 'kcc' | 'land_record'>('pm_kisan');
  const [pmKisanId, setPmKisanId] = useState(currentProfile.farmerVerification?.docNumber || 'PMK-MH-9812450');
  const [kccNumber, setKccNumber] = useState('KCC-6540-9821-4412');
  const [kccBank, setKccBank] = useState('State Bank of India');
  const [kccLimit, setKccLimit] = useState('160000');
  const [khasraNumber, setKhasraNumber] = useState('142/2A');
  const [khatauniNumber, setKhatauniNumber] = useState('88/B');
  const [landAcres, setLandAcres] = useState('4.5');
  const [subDistrict, setSubDistrict] = useState('Niphad Tehsil');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Kisan_Passbook_Khatauni_7-12.pdf');
  const [isVerifyingInstant, setIsVerifyingInstant] = useState(false);

  // Error validation banner & highlighted fields
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedLang(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  if (!isOpen) return null;

  const currentDistricts = state
    ? REGION_SELECT_OPTIONS.find((r) => r.state === state)?.districts || []
    : [];

  const handleLanguageChange = (lang: Language) => {
    if (isAuthenticated) {
      onShowToast(
        'Language Locked',
        'Language is locked while logged in. Please log out to change regional language.'
      );
      return;
    }
    setSelectedLang(lang);
    onSelectLanguage(lang);
    setValidationError(null);
  };

  const handleConfirmLanguage = () => {
    setIsLangConfirmed(true);
    setValidationError(null);
    setStep('auth');
  };

  // Step click navigation interceptor: strictly prevents skipping uncompleted steps
  const handleStepClick = (targetStep: 'language' | 'auth' | 'profile' | 'verification') => {
    setValidationError(null);

    if (targetStep === 'language') {
      setStep('language');
      return;
    }

    if (targetStep === 'auth') {
      if (!isLangConfirmed && !selectedLang) {
        setValidationError('Please complete this step before proceeding.');
        onShowToast('Please complete this step before proceeding.');
        return;
      }
      setStep('auth');
      return;
    }

    if (targetStep === 'profile') {
      if (!isOtpVerified) {
        setValidationError('Please complete this step before proceeding.');
        onShowToast('Please complete this step before proceeding.');
        return;
      }
      setStep('profile');
      return;
    }

    if (targetStep === 'verification') {
      if (!isOtpVerified || !name.trim() || !state || !district) {
        setValidationError('Please complete this step before proceeding.');
        onShowToast('Please complete this step before proceeding.');
        return;
      }
      if (role !== 'farmer') {
        onShowToast('Not Required', 'Consumer accounts do not require agricultural verification.');
        return;
      }
      setStep('verification');
      return;
    }
  };

  const handleSendOtp = () => {
    if (phone.trim().length < 10) {
      setValidationError('Please complete this step before proceeding.');
      onShowToast('Please complete this step before proceeding.', 'Enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setOtpTimer(30);
    setValidationError(null);
    onShowToast('SMS Verification Sent', `Verification code 4921 sent to +91 ${phone}`);
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join('');
    if (code === '4921' || code.length === 4) {
      setIsOtpVerified(true);
      setValidationError(null);
      setStep('profile');
      onShowToast(
        'Phone Verified Successfully',
        `+91 ${phone} confirmed via one-time password`
      );
    } else {
      setValidationError('Please complete this step before proceeding.');
      onShowToast('Please complete this step before proceeding.', 'Enter the 4-digit code (4921)');
    }
  };

  const handleProceedFromProfile = () => {
    const trimmedName = name.trim();
    if (!trimmedName || !state || !district) {
      setValidationError('Please complete this step before proceeding.');
      onShowToast('Please complete this step before proceeding.');
      return;
    }

    setValidationError(null);

    // If role is farmer, enforce mandatory step 4: Farmer Identity Verification!
    if (role === 'farmer') {
      setStep('verification');
    } else {
      // Consumer does not need farm certificate verification
      completeOnboarding({
        name: trimmedName,
        phone: phone.trim(),
        role: 'consumer',
        state,
        district,
        preferredLanguage: selectedLang,
        isVerified: true
      });
    }
  };

  const handleCompleteFarmerVerification = (status: 'verified' | 'pending') => {
    let docNumber = '';
    if (verificationDocType === 'pm_kisan') {
      docNumber = pmKisanId.trim() || 'PMK-MH-9812450';
    } else if (verificationDocType === 'kcc') {
      docNumber = kccNumber.trim() || 'KCC-6540-9821-4412';
    } else {
      docNumber = `Khasra-${khasraNumber}/Khatauni-${khatauniNumber}`;
    }

    if (!docNumber) {
      setValidationError('Please complete this step before proceeding.');
      onShowToast('Please complete this step before proceeding.');
      return;
    }

    const verificationDetails: FarmerVerificationDetails = {
      status,
      docType: verificationDocType,
      docNumber,
      landRecordDetails: verificationDocType === 'land_record' ? {
        khasraNumber,
        khatauniNumber,
        landAreaAcres: Number(landAcres) || 4.5,
        subDistrict
      } : undefined,
      kccDetails: verificationDocType === 'kcc' ? {
        bankName: kccBank,
        creditLimit: Number(kccLimit) || 160000
      } : undefined,
      certificateFileName: uploadedFileName || 'Kisan_Identity_Proof.pdf',
      submittedAt: new Date().toISOString(),
      verifiedAt: status === 'verified' ? new Date().toISOString() : undefined
    };

    if (status === 'verified') {
      setIsVerifyingInstant(true);
      setTimeout(() => {
        setIsVerifyingInstant(false);
        completeOnboarding({
          name: name.trim(),
          phone: phone.trim(),
          role: 'farmer',
          state,
          district,
          preferredLanguage: selectedLang,
          isVerified: true,
          farmName: farmName.trim() || undefined,
          farmSizeAcres: farmSize ? Number(farmSize) : undefined,
          primaryCrops: ['Tomatoes', 'Wheat', 'Onions', 'Potatoes'],
          farmerVerification: verificationDetails
        });
      }, 700);
    } else {
      completeOnboarding({
        name: name.trim(),
        phone: phone.trim(),
        role: 'farmer',
        state,
        district,
        preferredLanguage: selectedLang,
        isVerified: false,
        farmName: farmName.trim() || undefined,
        farmSizeAcres: farmSize ? Number(farmSize) : undefined,
        primaryCrops: ['Tomatoes', 'Wheat', 'Onions', 'Potatoes'],
        farmerVerification: verificationDetails
      });
    }
  };

  const completeOnboarding = (updatedProfile: UserProfile) => {
    onSaveProfile(updatedProfile);
    if (updatedProfile.role === 'farmer') {
      if (updatedProfile.farmerVerification?.status === 'verified') {
        onShowToast(
          'Verified Farmer Authenticated',
          `Agricultural identity verified via ${verificationDocType.toUpperCase()} • Kisaan Hub Active`
        );
      } else {
        onShowToast(
          'Farmer Credentials Submitted',
          'Verification status: Pending. Our agro nodal officer will verify within 24 hours.'
        );
      }
    } else {
      onShowToast(
        'Login Complete & Preferences Locked',
        `${updatedProfile.name} • ${updatedProfile.district}, ${updatedProfile.state}`
      );
    }
    if (onClose) {
      onClose();
    }
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      onShowToast('Document Attached', `${file.name} uploaded successfully`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#f8faf4] rounded-2xl shadow-2xl border border-[#c0c9be]/40 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Strip with Step Progress */}
        <div className="bg-[#14532d] text-white p-4 sm:p-5 flex flex-col gap-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={ASSETS.logo}
                alt="Annapurna"
                className="h-8 w-auto object-contain bg-white/10 rounded-lg p-1"
              />
              <div>
                <span className="font-['Outfit'] font-bold text-lg text-white leading-none block">
                  {t('appName', selectedLang)}
                </span>
                <span className="text-xs text-[#87c695] leading-tight">
                  {t('appTagline', selectedLang)}
                </span>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Stepper Navigation Indicator with Strict Lock Checks */}
          <div className="grid grid-cols-4 gap-1.5 pt-1 text-[11px]">
            {/* Step 1: Language */}
            <button
              onClick={() => handleStepClick('language')}
              className={`flex items-center gap-1 py-1.5 px-1.5 rounded-lg font-bold transition-all text-left ${
                step === 'language'
                  ? 'bg-white text-[#003b1b] shadow-sm'
                  : isLangConfirmed
                  ? 'bg-white/25 text-white'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                isLangConfirmed && step !== 'language' ? 'bg-[#87c695] text-[#00210d]' : 'bg-[#003b1b] text-white'
              }`}>
                {isLangConfirmed && step !== 'language' ? '✓' : '1'}
              </span>
              <span className="truncate">Language</span>
            </button>

            {/* Step 2: Auth */}
            <button
              onClick={() => handleStepClick('auth')}
              className={`flex items-center gap-1 py-1.5 px-1.5 rounded-lg font-bold transition-all text-left ${
                step === 'auth'
                  ? 'bg-white text-[#003b1b] shadow-sm'
                  : isOtpVerified
                  ? 'bg-white/25 text-white'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                isOtpVerified && step !== 'auth' ? 'bg-[#87c695] text-[#00210d]' : 'bg-[#003b1b] text-white'
              }`}>
                {isOtpVerified && step !== 'auth' ? '✓' : '2'}
              </span>
              <span className="truncate">Mobile</span>
            </button>

            {/* Step 3: Region & Profile */}
            <button
              onClick={() => handleStepClick('profile')}
              className={`flex items-center gap-1 py-1.5 px-1.5 rounded-lg font-bold transition-all text-left ${
                step === 'profile'
                  ? 'bg-white text-[#003b1b] shadow-sm'
                  : isOtpVerified && name.trim() && state && district
                  ? 'bg-white/25 text-white'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                isOtpVerified && name.trim() && state && district && step !== 'profile'
                  ? 'bg-[#87c695] text-[#00210d]'
                  : 'bg-[#003b1b] text-white'
              }`}>
                {isOtpVerified && name.trim() && state && district && step !== 'profile' ? '✓' : '3'}
              </span>
              <span className="truncate">Profile</span>
            </button>

            {/* Step 4: Verification (Farmers) */}
            <button
              onClick={() => handleStepClick('verification')}
              className={`flex items-center gap-1 py-1.5 px-1.5 rounded-lg font-bold transition-all text-left ${
                step === 'verification'
                  ? 'bg-white text-[#003b1b] shadow-sm'
                  : role === 'farmer' && currentProfile.farmerVerification?.status === 'verified'
                  ? 'bg-white/25 text-white'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                currentProfile.farmerVerification?.status === 'verified'
                  ? 'bg-[#87c695] text-[#00210d]'
                  : 'bg-[#003b1b] text-white'
              }`}>
                {currentProfile.farmerVerification?.status === 'verified' ? '✓' : '4'}
              </span>
              <span className="truncate">Verify</span>
            </button>
          </div>
        </div>

        {/* Prominent Interception Validation Error Alert */}
        {validationError && (
          <div className="bg-[#ba1a1a] text-white px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-top duration-150">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span className="flex-1">{validationError}</span>
            <button
              onClick={() => setValidationError(null)}
              className="text-white/80 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Modal Body: Content changes per step */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* ================= STEP 1: LANGUAGE PREFERENCE ================= */}
          {step === 'language' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                  Step 1: Choose Your Regional Language
                </h3>
                <p className="text-xs text-[#717970] mt-0.5">
                  Select your primary dialect. All market listings, advisories, and voice navigation will adapt to this script.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#003b1b] bg-[#eafaf1] ring-2 ring-[#003b1b]/20 shadow-xs'
                          : 'border-[#c0c9be]/50 bg-white hover:bg-[#edeee9]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#191c19]">
                            {lang.nativeLabel}
                          </span>
                          <span className="text-xs text-[#717970]">
                            ({lang.label})
                          </span>
                        </div>
                        <span className="text-[11px] text-[#404941] block mt-0.5">
                          {lang.region}
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#003b1b] bg-[#003b1b] text-white'
                            : 'border-[#c0c9be]'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-[14px]">
                            check
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleConfirmLanguage}
                  className="w-full py-3 bg-[#003b1b] hover:bg-[#14532d] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
                >
                  <span>Confirm Language & Proceed to Step 2</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: MOBILE OTP AUTHENTICATION ================= */}
          {step === 'auth' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                  Step 2: Mobile Authentication (One-Time Password)
                </h3>
                <p className="text-xs text-[#717970] mt-0.5">
                  Direct farm purchases and payouts require a verified 10-digit Indian phone number.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#c0c9be]/50 space-y-3">
                <label className="block text-xs font-bold text-[#404941]">
                  Mobile Number (मोबाइल नंबर)
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center bg-[#f3f4ef] border border-[#c0c9be] rounded-xl px-3 text-xs font-bold text-[#404941]">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9823049210"
                    disabled={isOtpVerified}
                    className="flex-1 bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                  />
                  {!isOtpVerified && (
                    <button
                      onClick={handleSendOtp}
                      disabled={phone.length < 10}
                      className="px-3.5 py-2 bg-[#003b1b] hover:bg-[#14532d] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      {otpSent ? 'Resend' : 'Send Code'}
                    </button>
                  )}
                </div>

                {otpSent && !isOtpVerified && (
                  <div className="pt-2 border-t border-[#c0c9be]/30 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#191c19]">
                        Enter 4-Digit Verification Code
                      </span>
                      <span className="text-[11px] text-[#717970]">
                        Test OTP: <strong>4921</strong>
                      </span>
                    </div>

                    <div className="flex gap-2 justify-center py-1">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newDigits = [...otpDigits];
                            newDigits[idx] = val;
                            setOtpDigits(newDigits);
                            if (val && idx < 3) {
                              document.getElementById(`otp-${idx + 1}`)?.focus();
                            }
                          }}
                          className="w-11 h-12 text-center text-lg font-bold font-mono border border-[#c0c9be] rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#717970]">
                      <span>Expires in: {otpTimer}s</span>
                      <button
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-[#14532d] text-white font-bold rounded-lg hover:bg-[#003b1b] transition-colors cursor-pointer"
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                )}

                {isOtpVerified && (
                  <div className="p-3 bg-[#eafaf1] rounded-xl border border-[#b1f2be] flex items-center gap-2 text-xs text-[#003b1b] font-bold">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Mobile +91 {phone} verified successfully.</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('language')}
                  className="px-4 py-2.5 border border-[#c0c9be] rounded-xl text-xs font-bold text-[#404941] hover:bg-[#edeee9] cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!isOtpVerified) {
                      setValidationError('Please complete this step before proceeding.');
                      onShowToast('Please complete this step before proceeding.');
                      return;
                    }
                    setStep('profile');
                  }}
                  className="flex-1 py-2.5 bg-[#003b1b] hover:bg-[#14532d] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Continue to Step 3 (Profile & Region)</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ROLE & REGION PROFILE ================= */}
          {step === 'profile' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                  Step 3: Account Profile & Agricultural Region
                </h3>
                <p className="text-xs text-[#717970] mt-0.5">
                  Select your role and geographic hub to access hyper-local farm dispatches and wholesale rates.
                </p>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#c0c9be]/50">
                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#404941] mb-1.5">
                    Select Your Role (आपकी भूमिका)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('farmer')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        role === 'farmer'
                          ? 'border-[#003b1b] bg-[#eafaf1] ring-2 ring-[#003b1b]/20 shadow-xs'
                          : 'border-[#c0c9be]/50 bg-white hover:bg-[#edeee9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px] text-[#003b1b]">
                        agriculture
                      </span>
                      <div>
                        <span className="font-bold text-xs text-[#191c19] block">
                          Farmer / Producer
                        </span>
                        <span className="text-[10px] text-[#717970]">
                          किसान / उत्पादक
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('consumer')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        role === 'consumer'
                          ? 'border-[#904d00] bg-[#fff4e5] ring-2 ring-[#904d00]/20 shadow-xs'
                          : 'border-[#c0c9be]/50 bg-white hover:bg-[#edeee9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px] text-[#904d00]">
                        shopping_basket
                      </span>
                      <div>
                        <span className="font-bold text-xs text-[#191c19] block">
                          Consumer / Buyer
                        </span>
                        <span className="text-[10px] text-[#717970]">
                          उपभोक्ता / खरीदार
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[#404941] mb-1">
                    Full Name (पूरा नाम) *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. Balwant Singh"
                    className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                  />
                </div>

                {/* State & District Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-[#404941] mb-1">
                      State (राज्य) *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setDistrict('');
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                    >
                      <option value="">Select State</option>
                      {REGION_SELECT_OPTIONS.map((r) => (
                        <option key={r.state} value={r.state}>
                          {r.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#404941] mb-1">
                      District Hub (जिला / मंडी) *
                    </label>
                    <select
                      value={district}
                      disabled={!state}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b] disabled:opacity-50"
                    >
                      <option value="">Select District</option>
                      {currentDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Farmer Optional fields */}
                {role === 'farmer' && (
                  <div className="pt-2 border-t border-[#c0c9be]/30 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-[#404941] mb-1">
                        Farm Enterprise Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="e.g. Sahyadri Organic Orchards"
                        className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#404941] mb-1">
                        Cultivated Land Size (Acres)
                      </label>
                      <input
                        type="number"
                        value={farmSize}
                        onChange={(e) => setFarmSize(e.target.value)}
                        placeholder="e.g. 4.5"
                        className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('auth')}
                  className="px-4 py-2.5 border border-[#c0c9be] rounded-xl text-xs font-bold text-[#404941] hover:bg-[#edeee9] cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedFromProfile}
                  className="flex-1 py-2.5 bg-[#003b1b] hover:bg-[#14532d] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
                >
                  <span>
                    {role === 'farmer'
                      ? 'Proceed to Mandatory Farmer Verification (Step 4)'
                      : 'Complete Registration & Lock Preferences'}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: MANDATORY FARMER IDENTITY VERIFICATION ================= */}
          {step === 'verification' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-[#003b1b]">
                      verified_user
                    </span>
                    <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                      Step 4: Agricultural Identity Verification
                    </h3>
                  </div>
                  <p className="text-xs text-[#717970] mt-0.5">
                    Mandatory authentication to protect genuine farmers and grant access to Kisaan Hub selling tools.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ffb95f]/30 text-[#904d00] text-[10px] font-bold border border-[#ffb95f]/40 whitespace-nowrap">
                  Mandatory Step
                </span>
              </div>

              {/* Credential Options Tabs */}
              <div className="bg-[#edeee9] p-1 rounded-xl flex gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setVerificationDocType('pm_kisan')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    verificationDocType === 'pm_kisan'
                      ? 'bg-white text-[#003b1b] shadow-xs'
                      : 'text-[#404941]'
                  }`}
                >
                  <span>PM-KISAN ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationDocType('kcc')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    verificationDocType === 'kcc'
                      ? 'bg-white text-[#003b1b] shadow-xs'
                      : 'text-[#404941]'
                  }`}
                >
                  <span>Kisan Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationDocType('land_record')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    verificationDocType === 'land_record'
                      ? 'bg-white text-[#003b1b] shadow-xs'
                      : 'text-[#404941]'
                  }`}
                >
                  <span>Land Record (7/12)</span>
                </button>
              </div>

              {/* Credential Input Card */}
              <div className="bg-white p-4 rounded-xl border border-[#c0c9be]/50 space-y-3 text-xs">
                {verificationDocType === 'pm_kisan' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-[#404941] mb-1">
                        PM-KISAN Beneficiary Registration ID *
                      </label>
                      <input
                        type="text"
                        value={pmKisanId}
                        onChange={(e) => setPmKisanId(e.target.value)}
                        placeholder="e.g. PMK-MH-9812450"
                        className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                      />
                    </div>

                    <div className="p-2.5 bg-[#eafaf1] rounded-xl border border-[#b1f2be] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#003b1b]">
                          check_circle
                        </span>
                        <div>
                          <span className="font-bold text-[#003b1b] block">AgriStack e-KYC Active</span>
                          <span className="text-[10px] text-[#404941]">Aadhaar DBT linked with state land register</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-[#003b1b] text-white rounded text-[10px] font-bold">
                        Pre-Verified
                      </span>
                    </div>
                  </div>
                )}

                {verificationDocType === 'kcc' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-[#404941] mb-1">
                        Kisan Credit Card (KCC) Number *
                      </label>
                      <input
                        type="text"
                        value={kccNumber}
                        onChange={(e) => setKccNumber(e.target.value)}
                        placeholder="e.g. KCC-6540-9821-4412"
                        className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-[#404941] mb-1">
                          Issuing Bank
                        </label>
                        <input
                          type="text"
                          value={kccBank}
                          onChange={(e) => setKccBank(e.target.value)}
                          placeholder="e.g. State Bank of India"
                          className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#404941] mb-1">
                          Sanctioned Limit (₹)
                        </label>
                        <input
                          type="number"
                          value={kccLimit}
                          onChange={(e) => setKccLimit(e.target.value)}
                          placeholder="e.g. 160000"
                          className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {verificationDocType === 'land_record' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-[#404941] mb-1">
                          Khasra / Survey No. *
                        </label>
                        <input
                          type="text"
                          value={khasraNumber}
                          onChange={(e) => setKhasraNumber(e.target.value)}
                          placeholder="e.g. 142/2A"
                          className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#404941] mb-1">
                          Khatauni No. *
                        </label>
                        <input
                          type="text"
                          value={khatauniNumber}
                          onChange={(e) => setKhatauniNumber(e.target.value)}
                          placeholder="e.g. 88/B"
                          className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-[#404941] mb-1">
                          Tehsil / Sub-District
                        </label>
                        <input
                          type="text"
                          value={subDistrict}
                          onChange={(e) => setSubDistrict(e.target.value)}
                          placeholder="e.g. Niphad"
                          className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#404941] mb-1">
                          Cultivated Acres
                        </label>
                        <input
                          type="text"
                          value={landAcres}
                          onChange={(e) => setLandAcres(e.target.value)}
                          placeholder="e.g. 4.5"
                          className="w-full bg-[#f8faf4] border border-[#c0c9be] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#003b1b]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Certificate Simulator */}
                <div className="pt-2 border-t border-[#c0c9be]/30">
                  <label className="block font-bold text-[#404941] mb-1.5">
                    Upload Certificate / Land Passbook / KCC Photo
                  </label>
                  <div className="border-2 border-dashed border-[#c0c9be] rounded-xl p-3 text-center bg-[#f8faf4] hover:bg-[#edeee9] transition-colors relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUploadSim}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                      <span className="material-symbols-outlined text-[24px] text-[#003b1b]">
                        cloud_upload
                      </span>
                      <span className="text-[11px] font-bold text-[#191c19]">
                        {uploadedFileName ? uploadedFileName : 'Click or Drag to Upload Land Document'}
                      </span>
                      <span className="text-[10px] text-[#717970]">
                        PDF, JPG, PNG up to 10MB (AgriStack Compliant)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Instant E-Verify vs Pending Review */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCompleteFarmerVerification('verified')}
                  disabled={isVerifyingInstant}
                  className="w-full py-3 bg-[#003b1b] hover:bg-[#14532d] disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                >
                  {isVerifyingInstant ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                      <span>Verifying with Government Agro DB...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Instant E-Verify & Activate Kisaan Hub (Verified Farmer)</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('profile')}
                    className="px-4 py-2 border border-[#c0c9be] rounded-xl text-xs font-bold text-[#404941] hover:bg-[#edeee9] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCompleteFarmerVerification('pending')}
                    className="flex-1 py-2 bg-[#ffb95f]/20 hover:bg-[#ffb95f]/30 text-[#904d00] border border-[#ffb95f]/60 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                    <span>Submit for Manual Review (Status: Pending Verification)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2.5 bg-[#f3f4ef] border-t border-[#c0c9be]/30 flex items-center justify-between text-[11px] text-[#717970]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#14532d]">
              shield_locked
            </span>
            <span>256-Bit Encrypted Agricultural Identity Registry</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#404941] font-bold hover:underline cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
