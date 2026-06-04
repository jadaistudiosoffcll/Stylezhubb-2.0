import React from "react";
import { Coins, LogOut, ShieldAlert, Award, Compass, Sparkles } from "lucide-react";
import { User, SystemSettings } from "../types";

interface BentoHeaderProps {
  user: User | null;
  settings: SystemSettings | null;
  onLogout: () => void;
  activeNav: string;
}

export default function BentoHeader({ user, settings, onLogout, activeNav }: BentoHeaderProps) {
  const getPageTitle = () => {
    switch (activeNav) {
      case "home": return "Dashboard HUB";
      case "generator": return "Fintech Simulator";
      case "marketplace": return "Escrow Digital Marketplace";
      case "blackroom": return "The Black Room Ring";
      case "profile": return "Profile & AML Security";
      case "brokers": return "Crypto Investment Brokers";
      default: return "StyleHub Core";
    }
  };

  const getPageSub = () => {
    switch (activeNav) {
      case "home": return "Overview stats, fast credit buy, and security guide.";
      case "generator": return "Pixel-perfect Nigeria bank transaction receipt generators.";
      case "marketplace": return "Buy premium numbers, boosting, or rent verified coders.";
      case "blackroom": return "Zero leak anonymous ring for peer digital trading.";
      case "profile": return "Review identity verification status and cashout limits.";
      case "brokers": return "Sovereign nodes with compound simulated APY and live trade signal telemetry.";
      default: return "Trade, Simulate, Escrow – Beyond boundaries.";
    }
  };

  return (
    <div className="bg-[#121620] border border-zinc-805 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
      {/* Platform Branding & Navigation Info */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-mono tracking-widest text-[#10B981] uppercase font-bold px-3 py-1 rounded-md bg-emerald-950/30 border border-emerald-500/20">
            StyleHub Fintech
          </span>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9.5px] font-bold">
            <span className="text-gray-500 text-[8px] font-mono uppercase tracking-widest mr-0.5">SPONSORED BY</span>
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>
          {settings?.custom_emblem_html && (
            <div
              id="admin-embedded-emblem"
              dangerouslySetInnerHTML={{ __html: settings.custom_emblem_html }}
              className="inline-block animate-fadeIn"
            />
          )}
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          {getPageTitle()}
          <span className="text-[11px] font-mono text-gray-400 font-normal">/ {getPageSub()}</span>
        </h1>
      </div>

      {/* User Stats & Action HUD */}
      {user ? (
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Balance Widget */}
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 px-4 shadow-inner">
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-[#10B981] flex items-center justify-center border border-emerald-500/20">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-zinc-400 font-bold block uppercase tracking-wider">
                {user.subscription_tier ? `${user.subscription_tier} tier` : "free basic"}
              </span>
              <span className="text-sm font-black text-[#10B981] font-mono tracking-tight block">
                {user.points.toLocaleString()} <span className="text-[10px] text-zinc-400 font-sans font-normal">PLS</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Alias Badge */}
            {user.black_room_alias && (
              <div className="bg-slate-900/60 border border-slate-850 p-2 px-3 rounded-xl text-center hidden sm:block">
                <span className="text-[8px] text-gray-500 block font-mono font-medium">CHEMICAL CODE</span>
                <span className="text-xs font-bold text-slate-200">{user.black_room_alias}</span>
              </div>
            )}

            {/* Logout Trigger */}
            <button
              id="platform-logout-btn"
              onClick={onLogout}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-slate-900/40 p-1.5 border border-slate-850 rounded-2xl text-xs font-semibold text-cyan-400 px-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" /> Guest Session active
        </div>
      )}
    </div>
  );
}
