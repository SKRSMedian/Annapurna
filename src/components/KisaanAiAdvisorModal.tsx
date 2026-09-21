import React, { useState } from 'react';
import { Language, RagQueryResult } from '../types';
import { localRagEngine } from '../services/localRagEngine';
import { TRENDING_AGRO_QA, TrendingQuestionItem } from '../data/trendingAgroQA';
import { useNetwork } from '../hooks/useNetwork';

interface KisaanAiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onShowToast: (title: string, sub?: string) => void;
}

export const KisaanAiAdvisorModal: React.FC<KisaanAiAdvisorModalProps> = ({
  isOpen,
  onClose,
  language,
  onShowToast
}) => {
  const { isOnline, toggleSimulation } = useNetwork();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RagQueryResult | null>(null);

  // Trending Q&A state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTrendingId, setExpandedTrendingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Topics' },
    { id: 'crops_pest', label: language === 'hi' ? 'कीट व फसल' : 'Pest Control' },
    { id: 'cold_chain_storage', label: language === 'hi' ? 'कोल्ड चेन व ढुलाई' : 'Cold Chain' },
    { id: 'grains_moisture', label: language === 'hi' ? 'अनाज व नमी' : 'Grain Storage' },
    { id: 'govt_schemes', label: language === 'hi' ? 'सरकारी योजना' : 'Govt & KCC' },
    { id: 'pricing_direct', label: language === 'hi' ? 'सीधी कमाई' : 'Direct Pricing' }
  ];

  const filteredTrending = selectedCategory === 'all'
    ? TRENDING_AGRO_QA
    : TRENDING_AGRO_QA.filter((item) => item.category === selectedCategory);

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await localRagEngine.query(q, language);
      setResult(res);
    } catch {
      onShowToast('Search Failed', 'Could not query knowledge base.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    const willBeSimulated = toggleSimulation();
    onShowToast(
      willBeSimulated ? 'Switched to Offline Mode' : 'Switched to Online Mode',
      willBeSimulated
        ? 'AI Pipeline automatically fell back to Local On-Device Vector RAG'
        : 'Reconnected to Cloud Vector DB'
    );
  };

  const handleSelectTrending = (item: TrendingQuestionItem) => {
    const qText = item.question[language] || item.question.en;
    setQuery(qText);
    if (expandedTrendingId === item.id) {
      setExpandedTrendingId(null);
    } else {
      setExpandedTrendingId(item.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#c0c9be]/40 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#c0c9be]/30 flex items-center justify-between bg-[#f8faf4]">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
              isOnline ? 'bg-[#003b1b] text-[#b1f2be]' : 'bg-[#fe932c] text-[#663500]'
            }`}>
              <span className="material-symbols-outlined text-[22px]">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                  {language === 'hi' ? 'किसान एआई सहायक (Kisaan AI Sahayak)' : 'Kisaan AI Sahayak (RAG)'}
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                  isOnline
                    ? 'bg-[#b1f2be]/40 text-[#003b1b] border-[#14532d]/20'
                    : 'bg-[#ffb95f]/30 text-[#904d00] border-[#904d00]/30 animate-pulse'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#14532d]' : 'bg-[#904d00]'}`} />
                  {isOnline ? 'Cloud Vector DB' : 'Local Vector RAG (Offline)'}
                </span>
              </div>
              <p className="text-[11px] text-[#717970] mt-0.5">
                {isOnline
                  ? 'Multilingual agricultural intelligence backed by Cloud Vector Database & Live Mandis'
                  : 'Zero data consumed: 100% on-device vector search from local agronomy repository'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#717970] hover:bg-[#e7e9e3] hover:text-[#191c19] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Network Mode Banner */}
        <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
          isOnline
            ? 'bg-[#eafaf1] text-[#003b1b] border-[#b1f2be]/50'
            : 'bg-[#fff4e5] text-[#904d00] border-[#ffb95f]/50'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">
              {isOnline ? 'cloud_done' : 'cloud_off'}
            </span>
            <span className="font-medium text-[11px] sm:text-xs">
              {isOnline
                ? 'Device Online: Live neural vector search + APMC mandi telemetry active'
                : 'Offline Mode: Local on-device vector embeddings with 0ms roundtrip'}
            </span>
          </div>
          <button
            onClick={handleToggleMode}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all border whitespace-nowrap ${
              isOnline
                ? 'bg-white text-[#904d00] border-[#ffb95f] hover:bg-[#fff4e5]'
                : 'bg-[#003b1b] text-white border-[#003b1b] hover:bg-[#14532d]'
            }`}
          >
            {isOnline ? 'Simulate Offline Mode' : 'Switch to Online'}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* Search Box */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-[#717970]">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  language === 'hi'
                    ? 'फसल रोग, जैविक दवा, नमी या मंडी भाव से जुड़ा प्रश्न पूछें...'
                    : 'Ask any agronomy, crop health, cold storage, or market question...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c0c9be] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#14532d] bg-[#f8faf4]"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-[#003b1b] hover:bg-[#14532d] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Ask RAG</span>
                </>
              )}
            </button>
          </div>

          {/* RAG Query Result (if active) */}
          {result && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-[#f8faf4] border border-[#c0c9be]/50 space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-2 flex-wrap gap-1">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                    result.pipeline === 'local_on_device_vector_rag'
                      ? 'bg-[#ffb95f]/30 text-[#904d00]'
                      : 'bg-[#b1f2be]/40 text-[#003b1b]'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {result.pipeline === 'local_on_device_vector_rag' ? 'memory' : 'cloud'}
                    </span>
                    {result.pipeline === 'local_on_device_vector_rag'
                      ? 'Local On-Device Vector RAG (Offline Active)'
                      : 'Cloud Neural Vector Database (Online)'}
                  </span>
                  <span className="text-[10px] text-[#717970] font-mono">
                    Latency: {result.latencyMs}ms
                  </span>
                </div>

                <div className="text-xs text-[#191c19] leading-relaxed whitespace-pre-line font-normal">
                  {result.answer}
                </div>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-[#404941] flex items-center gap-1 mb-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#14532d]">auto_stories</span>
                    Retrieved Knowledge Documents ({result.sources.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.sources.map((src) => (
                      <div
                        key={src.docId}
                        className="p-2.5 rounded-lg border border-[#c0c9be]/40 bg-white text-xs space-y-1 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#14532d] flex items-center gap-1 truncate text-[11px]">
                            <span className="bg-[#14532d]/10 text-[#14532d] px-1 py-0.2 rounded-sm text-[9px] font-mono">
                              {src.referenceCode}
                            </span>
                            <span className="truncate">{src.title}</span>
                          </span>
                          <span className="text-[10px] font-bold text-[#717970] whitespace-nowrap ml-1">
                            {Math.round(src.similarityScore * 100)}% Match
                          </span>
                        </div>
                        <p className="text-[10px] text-[#717970] italic line-clamp-2">
                          "{src.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= MULTILINGUAL TRENDING QUESTIONS SECTION ================= */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#003b1b]">
                  trending_up
                </span>
                <div>
                  <h4 className="font-['Outfit'] font-bold text-sm text-[#191c19]">
                    {language === 'hi' ? 'प्रचलित सवाल व विशेषज्ञ समाधान (Trending Questions)' : 'Trending Questions & Verified Solutions'}
                  </h4>
                  <p className="text-[10px] text-[#717970]">
                    {language === 'hi'
                      ? 'आपकी चुनी हुई भाषा में प्रमाणित कृषि वैज्ञानिकों द्वारा सत्यापित'
                      : 'Dynamically translated and verified for your regional language'}
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[#b1f2be]/40 text-[#003b1b] text-[10px] font-bold border border-[#b1f2be]">
                {language.toUpperCase()} Script Active
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#003b1b] text-white shadow-xs'
                      : 'bg-[#edeee9] text-[#404941] hover:bg-[#c0c9be]/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Trending Items List */}
            <div className="space-y-2.5">
              {filteredTrending.map((item) => {
                const isExpanded = expandedTrendingId === item.id;
                const questionText = item.question[language] || item.question.en;
                const summaryText = item.summary[language] || item.summary.en;
                const answerText = item.expertAnswer[language] || item.expertAnswer.en;
                const takeaways = item.keyTakeaways[language] || item.keyTakeaways.en;
                const catLabel = item.categoryLabel[language] || item.categoryLabel.en;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-[#003b1b] bg-[#f8faf4] shadow-md ring-1 ring-[#003b1b]/20'
                        : 'border-[#c0c9be]/40 bg-white hover:border-[#003b1b]/40 hover:shadow-xs'
                    }`}
                  >
                    {/* Header Clickable Area */}
                    <div
                      onClick={() => handleSelectTrending(item)}
                      className="p-3.5 sm:p-4 cursor-pointer flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 rounded-xl bg-[#eafaf1] text-[#003b1b] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">
                            {item.icon}
                          </span>
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap text-[10px]">
                            <span className="bg-[#14532d]/10 text-[#003b1b] px-2 py-0.5 rounded font-bold">
                              {catLabel}
                            </span>
                            <span className="font-mono text-[#717970]">
                              {item.referenceCode}
                            </span>
                            <span className="text-[#904d00] font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                              {item.popularityScore}% Trending
                            </span>
                            <span className="text-[#22c55e] font-semibold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">offline_pin</span>
                              Offline Cached
                            </span>
                          </div>

                          <h5 className="font-bold text-xs sm:text-sm text-[#191c19] leading-snug">
                            {questionText}
                          </h5>

                          <p className="text-[11px] text-[#404941] line-clamp-2">
                            {summaryText}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-7 h-7 rounded-full bg-[#f3f4ef] flex items-center justify-center text-[#717970] hover:text-[#191c19] flex-shrink-0 mt-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>

                    {/* Expanded Solution Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-[#c0c9be]/30 space-y-3 bg-white animate-in fade-in">
                        {/* Full Verified Answer */}
                        <div className="p-3.5 bg-[#f8faf4] rounded-xl border border-[#c0c9be]/40 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-[#003b1b] font-bold">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">verified</span>
                              AgriStack Verified Protocol
                            </span>
                            <span className="text-[10px] text-[#717970] font-normal">
                              0-Day Pre-Harvest Interval
                            </span>
                          </div>

                          <div className="text-xs text-[#191c19] leading-relaxed whitespace-pre-line font-normal">
                            {answerText}
                          </div>
                        </div>

                        {/* Key Action Points */}
                        <div>
                          <span className="text-[11px] font-bold text-[#404941] block mb-1">
                            Key Action Takeaways (मुख्य बिंदु):
                          </span>
                          <ul className="space-y-1">
                            {takeaways.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[11px] text-[#191c19]">
                                <span className="material-symbols-outlined text-[14px] text-[#003b1b] mt-0.5">
                                  check_circle
                                </span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleSearch(questionText)}
                            className="flex-1 py-2 bg-[#003b1b] hover:bg-[#14532d] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">analytics</span>
                            <span>Run Vector RAG Analysis</span>
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(`${questionText}\n\n${answerText}`);
                              onShowToast('Advisory Copied', 'Copied full answer to clipboard');
                            }}
                            className="px-3 py-2 border border-[#c0c9be] rounded-xl text-xs font-bold text-[#404941] hover:bg-[#edeee9] cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[15px]">content_copy</span>
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#f8faf4] border-t border-[#c0c9be]/30 flex items-center justify-between text-[11px] text-[#717970]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#14532d]">offline_pin</span>
            <span>Offline Cache: 6 trending agro Q&As + 10 vector agronomy docs active</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#edeee9] hover:bg-[#e7e9e3] text-[#191c19] rounded-lg font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
