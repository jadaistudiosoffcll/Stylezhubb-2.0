import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Coins, 
  TrendingUp, 
  ShieldAlert, 
  Play, 
  HelpCircle, 
  RefreshCw, 
  Sliders, 
  Check, 
  AlertOctagon, 
  DollarSign, 
  Timer,
  BookOpen,
  ArrowUpRight,
  TrendingDown,
  Info
} from "lucide-react";
import { User, CryptoBroker, CryptoBrokerInvestment } from "../types";

interface CryptoBrokersPortalProps {
  currentUser: User | null;
  onRefreshUser: () => void;
}

export default function CryptoBrokersPortal({ currentUser, onRefreshUser }: CryptoBrokersPortalProps) {
  const [brokers, setBrokers] = useState<CryptoBroker[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<CryptoBroker | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"terminal" | "readme" | "admin">("terminal");
  const [investAmount, setInvestAmount] = useState<string>("");
  const [unlockProcessing, setUnlockProcessing] = useState<string | null>(null);
  const [investProcessing, setInvestProcessing] = useState<string | null>(null);
  const [reclaimProcessing, setReclaimProcessing] = useState<string | null>(null);
  const [yieldProcessing, setYieldProcessing] = useState<string | null>(null);

  // Admin override controls
  const [adminApy, setAdminApy] = useState<string>("");
  const [adminCost, setAdminCost] = useState<string>("");
  const [adminMinInvest, setAdminMinInvest] = useState<string>("");
  const [adminStatus, setAdminStatus] = useState<boolean>(true);
  const [adminPointsGrant, setAdminPointsGrant] = useState<string>("100000");

  // Client-side artificial trade generator ticker
  const [dynamicTrades, setDynamicTrades] = useState<any[]>([]);

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    fetchBrokers();
  }, [currentUser]);

  // Generate real-time live trading ticks for unlocked terminals
  useEffect(() => {
    const tickers = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT", "LINK/USDT", "PEPE/USDT"];
    const interval = setInterval(() => {
      if (selectedBroker && selectedBroker.unlocked) {
        const selectedTicker = tickers[Math.floor(Math.random() * tickers.length)];
        const amount = Math.floor(Math.random() * 5000) + 100;
        const profitPct = (Math.random() * 8) - (selectedBroker.risk_level === "Extreme" ? 3.5 : 1.5);
        const isProfit = profitPct > 0;
        const profitPoints = parseFloat((amount * (profitPct / 100)).toFixed(2));

        const newTrade = {
          id: "tick-" + Date.now(),
          ticker: selectedTicker,
          amount,
          profit: profitPoints,
          time: "Just now"
        };

        setDynamicTrades((prev) => [newTrade, ...prev.slice(0, 10)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedBroker]);

  const fetchBrokers = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/crypto-brokers/list?userId=${currentUser.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBrokers(data);
        // Default select first broker on load if none selected
        if (!selectedBroker) {
          setSelectedBroker(data[0]);
        } else {
          const updatedSelected = data.find(b => b.id === selectedBroker.id);
          if (updatedSelected) setSelectedBroker(updatedSelected);
        }
      }
    } catch (err) {
      console.error("Error retrieving crypto brokers list:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBroker = (broker: CryptoBroker) => {
    setSelectedBroker(broker);
    setDynamicTrades(broker.mock_trades || []);
    // Reset admin panel values
    setAdminApy(String(broker.projected_apy));
    setAdminCost(String(broker.price_points));
    setAdminMinInvest(String(broker.minimum_investment_points));
    setAdminStatus(broker.is_active);
    setActiveSubTab("terminal");
  };

  const handleUnlockBroker = async (broker: CryptoBroker) => {
    if (!currentUser) return;
    if (currentUser.points < broker.price_points) {
      alert(`⚠️ Verification failed: You have ${currentUser.points} PLS points but this autonomous AI agent contract license costs ${broker.price_points} PLS.`);
      return;
    }

    if (!window.confirm(`Confirm spend of ${broker.price_points} PLS points to fully hire individual node "${broker.name}"? This initiates complete API autonomous access.`)) {
      return;
    }

    setUnlockProcessing(broker.id);
    try {
      const res = await fetch("/api/crypto-brokers/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          brokerId: broker.id
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🎉 Activation complete! ${broker.name} has signed terms of autonomy. Welcome to active terminal trading.`);
        onRefreshUser();
        await fetchBrokers();
      } else {
        alert(data.error || "Failed lock confirmation protocol.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUnlockProcessing(null);
    }
  };

  const handleInvestPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedBroker) return;

    const pointsToInvest = parseInt(investAmount);
    if (isNaN(pointsToInvest) || pointsToInvest <= 0) {
      alert("Invalid capital points input.");
      return;
    }

    if (pointsToInvest < selectedBroker.minimum_investment_points) {
      alert(`Minimum capital index for this broker block is ${selectedBroker.minimum_investment_points} PLS points.`);
      return;
    }

    if (currentUser.points < pointsToInvest) {
      alert(`Insufficient balance. You currently hold ${currentUser.points} PLS points.`);
      return;
    }

    setInvestProcessing(selectedBroker.id);
    try {
      const res = await fetch("/api/crypto-brokers/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          brokerId: selectedBroker.id,
          amountPoints: pointsToInvest
        })
      });
      const data = await res.json();
      if (data.success) {
        setInvestAmount("");
        onRefreshUser();
        await fetchBrokers();
      } else {
        alert(data.error || "DeFi allocation error.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInvestProcessing(null);
    }
  };

  const handleReclaimInvestment = async (investmentId: string) => {
    if (!currentUser) return;
    if (!window.confirm("Confirm liquidation of active portfolio capital and accrued yield compounding indices back into your primary StyleHub wallet?")) return;

    setReclaimProcessing(investmentId);
    try {
      const res = await fetch("/api/crypto-brokers/reclaim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          investmentId
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🌟 Portfolio Liquidated! Returned ${data.payoutPoints} PLS points successfully.`);
        onRefreshUser();
        await fetchBrokers();
      } else {
        alert(data.error || "Liquidation failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReclaimProcessing(null);
    }
  };

  const handleSimulateYield = async (investmentId: string) => {
    if (!currentUser) return;
    setYieldProcessing(investmentId);
    try {
      const res = await fetch("/api/crypto-brokers/simulate-yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          investmentId
        })
      });
      const data = await res.json();
      if (data.success) {
        // Play small visual ticker feedback
        await fetchBrokers();
      } else {
        alert(data.error || "Failed simulation step.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setYieldProcessing(null);
    }
  };

  const handleAdminUpdateBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedBroker) return;
    try {
      const res = await fetch("/api/admin/crypto-brokers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAdminId: currentUser.id,
          brokerId: selectedBroker.id,
          price_points: parseInt(adminCost),
          projected_apy: parseFloat(adminApy),
          minimum_investment_points: parseInt(adminMinInvest),
          is_active: adminStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`👑 Overlord Update applied securely to blockchain parameter configurations for ${selectedBroker.alias}!`);
        await fetchBrokers();
      } else {
        alert(data.error || "Failed sovereign configuration.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminPointsGift = async (amount: number) => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/admin/add-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAdminId: currentUser.id,
          targetUserId: currentUser.id,
          bonusPoints: amount
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`👑 Point Injection complete! Added +${amount} PLS points. New sovereign balance: ${data.newPoints} PLS.`);
        onRefreshUser();
      } else {
        alert(data.error || "Point gift failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Medium": return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "High": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Very High": return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
      case "Extreme": return "bg-rose-500/10 text-rose-500 border border-rose-500/30 animate-pulse";
      default: return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin HUD for Point Top up (at will) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-950/20 to-slate-900 border border-red-500/20 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              <h3 className="text-sm font-black uppercase text-red-500 tracking-wider">Sovereign Overlord Directives</h3>
            </div>
            <p className="text-xs text-gray-400 max-w-xl">
              You possess master sovereign admin token controls. Inject free credit assets directly into your primary wallet instantly. No escrow holds, immediate settlement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => handleAdminPointsGift(1000000)}
              className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-red-650 to-rose-600 hover:brightness-110 active:scale-95 text-[11px] font-mono font-black text-white rounded-xl shadow-lg shadow-red-500/10 border border-red-500/30 transition-all cursor-pointer"
            >
              👑 Gift Self +1M PLS Points
            </button>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl flex-1 md:flex-none max-w-xs">
              <input
                type="number"
                value={adminPointsGrant}
                onChange={(e) => setAdminPointsGrant(e.target.value)}
                className="bg-transparent text-white font-mono text-xs w-20 px-2 outline-none border-none text-center"
              />
              <button
                onClick={() => handleAdminPointsGift(parseInt(adminPointsGrant) || 0)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
              >
                Inject custom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Broker Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar: Lists 5 Crypto Investment Brokers */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="bg-[#0B0E14] border border-slate-800/80 rounded-3xl p-5 shadow-xl">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-850">
              <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                🎯 Nodes Active (5)
              </span>
              <button 
                onClick={fetchBrokers}
                className="p-1 rounded bg-slate-900 border border-slate-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                title="Synchronize indices"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {loading && brokers.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 font-mono animate-pulse">
                  Querying automated broker pools...
                </div>
              ) : (
                brokers.map((b) => {
                  const isCurrent = selectedBroker?.id === b.id;
                  const hasActiveInv = b.activeInvestment && b.activeInvestment.status === "active";
                  const apyColor = b.risk_level === "Extreme" ? "text-rose-400" : b.risk_level === "Very High" ? "text-orange-400" : "text-emerald-400";

                  return (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBroker(b)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer block relative overflow-hidden ${
                        isCurrent 
                          ? "bg-slate-900/90 border-[#00E5FF]/60 shadow-lg shadow-cyan-500/5" 
                          : "bg-slate-950 hover:bg-slate-900/40 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      {/* Active investment bar indicator */}
                      {hasActiveInv && (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#00E5FF]"></div>
                      )}

                      <div className="flex justify-between items-start gap-1.5">
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5 tracking-tight">
                            {b.alias}
                            {!b.is_active && (
                              <span className="text-[8px] bg-red-950/20 text-red-500 border border-red-500/20 px-1 py-0.2 rounded font-mono font-bold">
                                MAINT
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono block mt-0.5 mt-1">
                            Lock Price: <span className="text-yellow-500 font-bold font-sans">{b.price_points} PLS</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-black font-mono block ${apyColor}`}>
                            +{b.projected_apy}% <span className="text-[8px] text-gray-400 uppercase font-sans font-medium">APY</span>
                          </span>
                          <span className={`inline-block mt-1 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-full ${getRiskBadgeColor(b.risk_level)}`}>
                            {b.risk_level}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center border-t border-slate-900/60 pt-2.5 text-[9px] text-gray-400 font-mono">
                        <span className="flex items-center gap-1">
                          {b.unlocked ? (
                            <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                              <Unlock className="w-2.5 h-2.5" /> Activated
                            </span>
                          ) : (
                            <span className="text-gray-500 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5 text-yellow-600" /> Subscription Limit
                            </span>
                          )}
                        </span>
                        {hasActiveInv && (
                          <span className="text-cyan-400 font-bold bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-500/10">
                            🛡️ {b.activeInvestment?.amountPoints} PLS Locked
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick instructions widget */}
          <div className="bg-[#0B0E14]/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl text-xs space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Sandbox Disclosures
            </h4>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Rent verified autonomous crypto brokers programmed by Jadai Studios. View transparent strategy terms via the <strong>Whitepaper (T&C) tab</strong>. Locked nodes restrict visual dashboards and hide live transaction outputs. Pay required Points to secure full trading activation.
            </p>
          </div>
        </div>

        {/* Selected Broker Workspace Terminals */}
        <div className="lg:col-span-8 space-y-4">
          {selectedBroker ? (
            <div className="bg-[#0B0E14] border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              
              {/* Highlight Backdrop aura depending on risk */}
              <div className="absolute top-0 right-0 h-40 w-40 bg-[#00E5FF]/3 rounded-full blur-3xl pointer-events-none"></div>

              {/* Header Title Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-850 pb-5 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#00E5FF]/10 text-[#00E5FF] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                      INVESTMENT NODE
                    </span>
                    <span className={`text-[10px] uppercase font-bold ${getRiskBadgeColor(selectedBroker.risk_level)}`}>
                      {selectedBroker.risk_level} Risk profile
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
                    {selectedBroker.name} 
                    <span className="text-[10.5px] font-mono text-gray-500 font-normal underline">
                      ({selectedBroker.alias})
                    </span>
                  </h2>
                </div>

                <div className="flex border border-slate-800 bg-slate-950 p-1 rounded-xl text-[10px] font-bold">
                  <button
                    onClick={() => setActiveSubTab("terminal")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeSubTab === "terminal" ? "bg-slate-850 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Control Panel
                  </button>
                  <button
                    onClick={() => setActiveSubTab("readme")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeSubTab === "readme" ? "bg-slate-850 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Strategy Readme
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setActiveSubTab("admin")}
                      className={`px-3 py-1.5 rounded-lg text-rose-400 transition-all cursor-pointer flex items-center gap-1 bg-rose-950/10 border border-rose-900/10 ${
                        activeSubTab === "admin" ? "bg-rose-950/30 text-rose-300 border-rose-800/40" : "hover:text-rose-200"
                      }`}
                    >
                      <Sliders className="w-3 h-3" /> Overrule Engine
                    </button>
                  )}
                </div>
              </div>

              {/* SUB TAB 1: FRONTEND TRADING TERMINAL PANEL */}
              {activeSubTab === "terminal" && (
                <div className="space-y-6">
                  {/* Summary row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Projected APY</span>
                      <span className="text-base font-black text-emerald-400 mt-1 block font-mono">
                        +{selectedBroker.projected_apy}%
                      </span>
                    </div>
                    <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Minimum Allocation</span>
                      <span className="text-base font-black text-[#00E5FF] mt-1 block font-mono">
                        {selectedBroker.minimum_investment_points} PLS
                      </span>
                    </div>
                    <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl col-span-2">
                      <p className="text-[11px] text-gray-400 leading-normal mt-1">
                        {selectedBroker.description}
                      </p>
                    </div>
                  </div>

                  {/* Lock Screen Cover Mask */}
                  {!selectedBroker.unlocked && !isAdmin ? (
                    <div className="relative border border-amber-500/20 bg-amber-950/5 rounded-3xl p-6 overflow-hidden flex flex-col justify-center items-center text-center space-y-4 shadow-inner py-12 select-none">
                      <div className="absolute top-0 right-0 left-0 bottom-0 bg-[#0B0E14]/85 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="h-12 w-12 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center justify-center shadow shadow-yellow-500/10 animate-bounce">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 max-w-md">
                          <h4 className="text-sm font-black text-white tracking-wide uppercase">Premium Autonomous Node Locked</h4>
                          <p className="text-[11px] text-gray-400 max-w-sm leading-relaxed">
                            Full access to order tickers, point allocations, dynamic compound farming yield cyles, and risk parameter customization is restricted. Unlocked by paying system charter points.
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleUnlockBroker(selectedBroker)}
                          disabled={unlockProcessing !== null}
                          className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 font-black text-xs text-gray-950 rounded-xl shadow-lg border border-yellow-500/20 active:scale-95 transition-all text-center flex items-center gap-2 cursor-pointer"
                        >
                          {unlockProcessing === selectedBroker.id ? (
                            "Chartering..."
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5 text-gray-900" /> Charter Node and Fully Unlock for {selectedBroker.price_points} PLS
                            </>
                          )}
                        </button>
                      </div>

                      {/* Fake blurred layout beneath mask for high-fidelity aesthetics */}
                      <span className="text-xs text-gray-600 font-mono">SIMULATION BLURRED CONTENT</span>
                    </div>
                  ) : (
                    /* UNLOCKED TERMINAL ENGINE */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      
                      {/* Left: Investment Engine Controls */}
                      <div className="md:col-span-6 space-y-4">
                        <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
                          <h3 className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider mb-3.5 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                            <Coins className="w-4 h-4 text-cyan-400" /> Point Allocation Panel
                          </h3>

                          {selectedBroker.activeInvestment ? (
                            /* ACTIVE INVESTMENT SCREEN */
                            <div className="space-y-4">
                              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-400">Capital Locked:</span>
                                  <span className="font-mono text-white font-bold">
                                    {selectedBroker.activeInvestment.amountPoints} PLS
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-400">Yield Accrued:</span>
                                  <span className={`font-mono font-black ${selectedBroker.activeInvestment.yieldPoints >= 0 ? "text-emerald-400 animate-pulse" : "text-rose-400"}`}>
                                    {selectedBroker.activeInvestment.yieldPoints >= 0 ? "+" : ""}{selectedBroker.activeInvestment.yieldPoints} PLS
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-850/60 font-black">
                                  <span className="text-slate-300">Total Simulation Value:</span>
                                  <span className="font-mono text-[#00E5FF]">
                                    {selectedBroker.activeInvestment.amountPoints + (selectedBroker.activeInvestment.yieldPoints || 0)} PLS
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSimulateYield(selectedBroker.activeInvestment!.id)}
                                  disabled={yieldProcessing !== null}
                                  className="py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-xs text-slate-950 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow shadow-emerald-500/10 border border-emerald-500/10"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${yieldProcessing ? "animate-spin" : ""}`} /> 
                                  {yieldProcessing ? "Ticking..." : "Simulate Yield"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReclaimInvestment(selectedBroker.activeInvestment!.id)}
                                  disabled={reclaimProcessing !== null}
                                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl cursor-pointer transition-all active:scale-95"
                                >
                                  {reclaimProcessing ? "Refunding..." : "Claim Capital"}
                                </button>
                              </div>
                              <p className="text-[9.5px] text-gray-500 text-center italic mt-1 leading-tight">
                                Click 'Simulate Yield' to calculate a live blockchain epoch block rewards yield simulation! Claim back at any time.
                              </p>
                            </div>
                          ) : (
                            /* INACTIVE INVESTMENT: ALLOW ALLOCATION */
                            <form onSubmit={handleInvestPoints} className="space-y-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                  Allocate Points Capital PLS
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={investAmount}
                                    onChange={(e) => setInvestAmount(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 font-mono text-xs text-white pr-12 focus:outline-none focus:border-[#00E5FF]/40"
                                    placeholder={`Min ${selectedBroker.minimum_investment_points} points...`}
                                  />
                                  <span className="absolute right-4 top-3.5 font-mono text-xs font-bold text-gray-500 select-none">
                                    PLS
                                  </span>
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={investProcessing !== null}
                                className="w-full py-2.5 bg-[#00E5FF] hover:bg-cyan-500 font-black text-xs text-gray-950 rounded-xl shadow-lg border border-[#00E5FF]/20 cursor-pointer active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                              >
                                {investProcessing ? (
                                  "Allocating..."
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5 text-gray-950" /> Allocate capital to AI trading pool
                                  </>
                                )}
                              </button>
                              <div className="text-[9.5px] text-gray-500 text-center leading-relaxed">
                                Funds lock programmatically into active automated multi-sig ledger. High projected yield cycle simulation with zero settlement delay.
                              </div>
                            </form>
                          )}
                        </div>

                        {/* Status Check card */}
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow animate-pulse">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[9px] text-emerald-400 font-black font-mono tracking-widest block uppercase">
                              AUTONOMOUS NODE SECURED
                            </span>
                            <p className="text-[10.5px] text-gray-450 mt-0.5 leading-tight">
                              Safe smart contract lock integrity verified. Liquidation bounds active.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Ticker Signal Stream Feed */}
                      <div className="md:col-span-6 space-y-3">
                        <div className="bg-slate-950 border border-[#00E5FF]/10 rounded-2xl p-4 flex flex-col h-[280px]">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3">
                            <span className="text-[9.5px] font-mono font-black text-slate-350 flex items-center gap-1 uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Live Trading Signal Feed
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">Ticker update automatic</span>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin pr-1 text-[10.5px]">
                            {dynamicTrades.length === 0 ? (
                              <div className="h-full flex items-center justify-center text-gray-600 italic text-center text-xs">
                                Streaming live ledger trades...
                              </div>
                            ) : (
                              dynamicTrades.map((t) => {
                                const isProf = t.profit >= 0;
                                return (
                                  <div key={t.id} className="flex justify-between items-center border-b border-slate-900/40 pb-1.5 text-slate-300">
                                    <div className="font-mono">
                                      <span className="font-bold text-gray-200">{t.ticker}</span>
                                      <span className="text-[9px] text-gray-500 block">Cap: {t.amount} PLS</span>
                                    </div>
                                    <div className="text-right">
                                      <span className={`font-black font-mono flex items-center justify-end gap-0.5 ${isProf ? "text-emerald-400" : "text-rose-400"}`}>
                                        {isProf ? <ArrowUpRight className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                        {isProf ? "+" : ""}{t.profit} PLS
                                      </span>
                                      <span className="text-[8.5px] text-gray-500 font-mono">{t.time || "Just now"}</span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* SUB TAB 2: DETAILED STRATEGY STRUCUTRED READING */}
              {activeSubTab === "readme" && (
                <div className="space-y-4">
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl font-mono text-xs text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto space-y-4 whitespace-pre-wrap">
                    <h3 className="text-sm font-black text-[#00E5FF] tracking-wider border-b border-slate-900 pb-2 mb-4 flex items-center gap-1.5 font-sans font-black">
                      <BookOpen className="w-4 h-4 text-cyan-400" /> Operational Protocol & Custody terms
                    </h3>
                    
                    {/* Parse manual strategies custom styling */}
                    <div className="font-sans text-xs text-gray-300 space-y-4 font-normal">
                      <p>
                        Our specialized digital contracts govern allocation custody. Review strategy disclosures before deploying active core points capital.
                      </p>
                      
                      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950">
                        <h4 className="font-bold text-white uppercase text-[10.5px] tracking-wide mb-2 flex items-center gap-1.5 text-[#00E5FF]">
                          📋 Strategy Parameters Sheet
                        </h4>
                        <ul className="space-y-2 text-[11px] list-disc pl-5">
                          <li><strong>DEX Multi-Routing Scanning:</strong> Programmed cross DEX integrations. Checks and routes liquid pools automatically twice every hour block.</li>
                          <li><strong>Leverage Capital Risk limits:</strong> Margin metrics strictly secured underneath automatic trailing Stops which sell allocation locks on crash.</li>
                          <li><strong>Direct Compound:</strong> Built-in simulated yield generators reinvest capital blocks with 1-click execution.</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-rose-900/20 bg-rose-950/5 rounded-xl">
                        <h4 className="font-black text-rose-500 uppercase text-[10.5px] tracking-wide mb-1.5 flex items-center gap-1.5 leading-none">
                          <ShieldAlert className="w-4 h-4 text-rose-500" /> General Risk Limit Disclosures
                        </h4>
                        <p className="text-[10.5px] text-gray-400 leading-normal">
                          Crypto trading simulations carry extreme directional and delta risks. Liquidations are fully simulated on extreme market shocks. StyleHub & Jadai Studios bear zero coverage for points lost inside High/Extreme volatility allocation pools.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB 3: ADMIN SOVEREIGN OVERRIDE PANEL */}
              {activeSubTab === "admin" && isAdmin && (
                <form onSubmit={handleAdminUpdateBroker} className="space-y-5">
                  <div className="p-4 bg-red-955/5 border border-red-500/20 rounded-2xl flex items-center gap-2.5">
                    <AlertOctagon className="w-5 h-5 text-red-500" />
                    <div>
                      <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block font-mono">
                        SOVEREIGN OVERRULING ACTIVE
                      </span>
                      <p className="text-[11px] text-slate-350 leading-tight">
                        Modifying global parameters changes live values database immediately. Ensure strict balance checks.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">APY Rate %</label>
                      <input
                        type="number"
                        value={adminApy}
                        onChange={(e) => setAdminApy(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white text-emerald-400"
                        placeholder="Projected APY value"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Unlock Cost Points</label>
                      <input
                        type="number"
                        value={adminCost}
                        onChange={(e) => setAdminCost(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white text-yellow-500"
                        placeholder="Unlock cost PLS"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Min Invest</label>
                      <input
                        type="number"
                        value={adminMinInvest}
                        onChange={(e) => setAdminMinInvest(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white"
                        placeholder="Min points"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase block">Node Status</label>
                      <select
                        value={String(adminStatus)}
                        onChange={(e) => setAdminStatus(e.target.value === "true")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="true">Active & Open</option>
                        <option value="false">Maintenance Lock</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-red-650 to-red-500 text-white font-mono font-black text-xs uppercase rounded-xl tracking-wider hover:brightness-110 shadow cursor-pointer active:scale-95 transition-all"
                  >
                    🚀 Enforce Sovereign Parameter Overwrites
                  </button>
                </form>
              )}

            </div>
          ) : (
            <div className="bg-[#0B0E14] border border-slate-800/80 rounded-3xl p-12 text-center text-xs text-gray-500 italic font-mono flex items-center justify-center h-full">
              Select an active autonomous crypto node from the list directory to start.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
