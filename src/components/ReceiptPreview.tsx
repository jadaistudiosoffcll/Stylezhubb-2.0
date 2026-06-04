import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { Download, Lock, CheckCircle2, ShieldAlert } from "lucide-react";

interface ReceiptPreviewProps {
  bank: string;
  senderName: string;
  receiverName: string;
  receiverBank: string;
  amount: number;
  dateTime: string;
  transactionId: string;
  reference: string;
  balance: number;
  customField?: string;
  unlocked: boolean;
  onUnlock?: () => void;
  isLoadingUnlock?: boolean;
}

export default function ReceiptPreview({
  bank,
  senderName,
  receiverName,
  receiverBank,
  amount,
  dateTime,
  transactionId,
  reference,
  balance,
  customField,
  unlocked,
  onUnlock,
  isLoadingUnlock = false,
}: ReceiptPreviewProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleDownloadPNG = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, // Over-sampled for Ultra HD quality
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `StyleHub_${bank}_Receipt_${transactionId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate receipt image:", err);
    }
  };

  // 1. OPay
  const renderOPay = () => (
    <div className="bg-white text-gray-800 p-6 font-sans w-full max-w-[400px] border border-gray-100 rounded-lg shadow-sm">
      <div className="flex flex-col items-center border-b border-gray-100 pb-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mb-2">
          <CheckCircle2 className="text-white w-7 h-7" />
        </div>
        <h2 className="text-emerald-500 font-bold text-xl tracking-wide">OPay</h2>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Transaction Receipt</span>
      </div>

      <div className="flex flex-col items-center my-5 bg-emerald-50/50 py-3 rounded-lg w-full">
        <span className="text-xs text-gray-500 font-medium">Transaction Amount</span>
        <span className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(amount)}</span>
        <span className="text-[10px] text-emerald-500 font-semibold px-2 py-0.5 bg-emerald-100 rounded-full mt-2">Transfer Successful</span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-medium">Recipient Name</span>
          <span className="text-gray-900 font-semibold text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-medium">Recipient Bank</span>
          <span className="text-gray-900 font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-medium">Sender Name</span>
          <span className="text-gray-900 font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-medium">Transaction Date</span>
          <span className="text-gray-700 font-semibold">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-medium">Transaction ID</span>
          <span className="text-gray-700 font-mono font-medium">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-medium">Wallet Balance</span>
          <span className="text-gray-900 font-semibold">{formatCurrency(balance)}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-medium">Reference</span>
          <span className="text-gray-700 italic">{reference}</span>
        </div>
      </div>

      {customField && (
        <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-100/50 rounded-lg flex items-center justify-between">
          <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">🍀 OWealth Booster</span>
          <span className="text-xs font-black text-emerald-700">{customField}</span>
        </div>
      )}

      <div className="text-[9px] text-gray-300 text-center mt-6 uppercase tracking-widest border-t border-gray-100 pt-3">
        StyleHub Receipt Simulator
      </div>
    </div>
  );

  // 2. Kuda
  const renderKuda = () => (
    <div className="bg-[#401965] text-white p-6 font-sans w-full max-w-[400px] border border-indigo-950 rounded-lg shadow-sm">
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-black tracking-wider text-purple-200">kuda.</h2>
          <p className="text-[9px] text-purple-300">The Bank of the Free</p>
        </div>
        <div className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] text-purple-200 font-mono tracking-wide uppercase">SUCCESS</div>
      </div>

      <div className="my-5 flex flex-col items-center">
        <span className="text-[11px] text-purple-300 uppercase tracking-widest font-semibold">Transaction Amount</span>
        <span className="text-3xl font-black text-white mt-1.5">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-purple-300">Sent To</span>
          <span className="text-white font-bold text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-purple-300">Destination Bank</span>
          <span className="text-white font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-purple-300">Sender Name</span>
          <span className="text-white font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-purple-300">Session Date</span>
          <span className="text-white/90">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-purple-300">Reference ID</span>
          <span className="text-purple-200 font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-purple-300">Description</span>
          <span className="text-white/80 italic">{reference}</span>
        </div>
      </div>

      {customField && (
        <div className="mt-5 p-2 bg-white/5 rounded border border-white/10 text-[10px] text-center text-purple-200">
          🔑 SafeGuard ID: {customField}
        </div>
      )}

      <div className="text-[9px] text-purple-400 text-center mt-6 uppercase tracking-widest border-t border-white/10 pt-3">
        StyleHub Receipt Engine
      </div>
    </div>
  );

  // 3. Moniepoint
  const renderMoniepoint = () => (
    <div className="bg-[#002B49] text-white p-6 font-sans w-full max-w-[400px] border border-blue-950 rounded-lg shadow-sm">
      <div className="flex flex-col items-center border-b border-blue-900 pb-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-400 font-black text-2xl tracking-tight">moniepoint</span>
        </div>
        <span className="text-[10px] text-gray-300 tracking-widest uppercase font-semibold">Transaction Statement</span>
      </div>

      <div className="bg-amber-500 text-gray-950 p-3 rounded-lg flex justify-between items-center my-4 font-black">
        <span className="text-xs uppercase">AMOUNT TRANSFER</span>
        <span className="text-xl">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between border-b border-blue-900/40 pb-2">
          <span className="text-gray-400">Status</span>
          <span className="text-emerald-400 font-black tracking-wide uppercase">● SUCCESSFUL</span>
        </div>
        <div className="flex justify-between border-b border-blue-900/40 pb-2">
          <span className="text-gray-400">Recipient</span>
          <span className="text-white font-bold text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-blue-900/40 pb-2">
          <span className="text-gray-400">Recipient Bank</span>
          <span className="text-white font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-blue-900/40 pb-2">
          <span className="text-gray-400">Sender</span>
          <span className="text-white font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-blue-900/40 pb-2">
          <span className="text-gray-400">Receipt Ref</span>
          <span className="text-white/85 font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-blue-900/40 pb-2">
          <span className="text-gray-400">Timestamp</span>
          <span className="text-white/80">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-blue-900/40 pb-2">
          <span className="text-gray-400">Reference Remarks</span>
          <span className="text-white/80">{reference}</span>
        </div>
      </div>

      {customField && (
        <div className="mt-4 p-2.5 bg-blue-950 border border-blue-900 rounded-lg flex items-center justify-between text-[11px]">
          <span className="text-amber-400 font-bold uppercase">POS Merchant Terminal</span>
          <span className="text-white font-mono">{customField}</span>
        </div>
      )}

      <div className="text-[9px] text-gray-500 text-center mt-6 uppercase tracking-widest pt-3">
        Powered by StyleHub
      </div>
    </div>
  );

  // 4. PalmPay
  const renderPalmPay = () => (
    <div className="bg-white text-gray-800 p-6 font-sans w-full max-w-[400px] border border-gray-100 rounded-lg shadow-sm">
      <div className="flex flex-col items-center border-b border-indigo-50 pb-4 mb-4">
        <div className="flex items-center gap-1.5 mb-1 text-indigo-600">
          <span className="text-xl font-black italic tracking-wide text-indigo-700">PalmPay</span>
        </div>
        <span className="text-[9px] text-indigo-500 font-black tracking-wider uppercase">Successful Transfer Receipt</span>
      </div>

      <div className="flex flex-col items-center my-5 border-l-4 border-l-indigo-600 bg-indigo-50/20 py-3 px-4 w-full rounded-r-lg">
        <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-black">Transaction Amount</span>
        <span className="text-2xl font-black text-indigo-800 mt-1">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-semibold">Beneficiary Name</span>
          <span className="text-gray-800 font-bold text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-semibold">Beneficiary Bank</span>
          <span className="text-gray-800 font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-semibold">Sender Details</span>
          <span className="text-gray-800 font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-semibold">Created Date</span>
          <span className="text-gray-650">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-semibold">Reference Transaction</span>
          <span className="text-gray-700 font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400 font-semibold">Fund Remarks</span>
          <span className="text-gray-700 italic">{reference}</span>
        </div>
      </div>

      {customField && (
        <div className="mt-4 p-2 bg-indigo-50 text-[10px] text-indigo-700 font-bold text-center rounded border border-indigo-100">
          🌟 Gift Claim: {customField}
        </div>
      )}

      <div className="text-[9px] text-gray-300 text-center mt-6 uppercase tracking-widest border-t border-gray-100 pt-3">
        StyleHub Receipt Creator
      </div>
    </div>
  );

  // 5. GTBank (Guaranty Trust Bank)
  const renderGTBank = () => (
    <div className="bg-white text-gray-800 p-6 font-sans w-full max-w-[400px] border-t-8 border-t-orange-500 rounded-lg shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <div>
          <h2 className="text-orange-500 text-xl font-black tracking-tighter">GTBank</h2>
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Guaranty Trust Bank</span>
        </div>
        <div className="bg-orange-50 px-2 py-0.5 rounded text-[10px] text-orange-600 font-mono uppercase tracking-wider font-bold">SUCCESSFUL</div>
      </div>

      <div className="my-5 bg-gray-50 p-4 rounded-lg flex flex-col items-center">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">VALUE TRANSFERRED</span>
        <span className="text-2xl font-black text-gray-800 mt-1">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3.5 text-xs text-gray-700">
        <div className="flex justify-between border-b border-gray-100 pb-1.5">
          <span className="text-gray-400">Recipient Name</span>
          <span className="text-gray-900 font-black text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1.5">
          <span className="text-gray-400">Recipient Bank</span>
          <span className="text-gray-900 font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1.5">
          <span className="text-gray-400">Sender Details</span>
          <span className="text-gray-900 font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1.5">
          <span className="text-gray-400">Transaction Date</span>
          <span className="text-gray-700">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1.5">
          <span className="text-gray-400">GT Ref ID</span>
          <span className="text-gray-700 font-mono font-semibold">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1.5">
          <span className="text-gray-400">Narration</span>
          <span className="text-gray-700 italic">{reference}</span>
        </div>
      </div>

      <div className="text-[8px] text-gray-300 text-center mt-6 uppercase tracking-wider pt-3">
        Guaranty Trust Bank PLC - Generated via StyleHub
      </div>
    </div>
  );

  // 6. Access Bank
  const renderAccess = () => (
    <div className="bg-white text-gray-800 p-6 font-sans w-full max-w-[400px] border border-gray-100 rounded-lg shadow-sm">
      <div className="flex justify-between items-center border-b-2 border-orange-500 pb-3 mb-4">
        <div>
          <span className="text-blue-900 text-lg font-black tracking-tight">access</span>
          <span className="text-[#E76C09] text-xs font-semibold ml-1">bank</span>
        </div>
        <div className="text-[10px] text-gray-400 tracking-wider">TRANSFER RECEIPT</div>
      </div>

      <div className="my-5 flex justify-between items-center bg-blue-50/50 p-3 rounded-lg border-l-4 border-blue-900">
        <span className="text-xs text-blue-900 font-bold">TOTAL AMOUNT</span>
        <span className="text-xl font-black text-blue-900">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3.5 text-xs text-gray-700">
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Recipient Account</span>
          <span className="text-gray-900 font-black text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Destination Bank</span>
          <span className="text-gray-900 font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Initiator</span>
          <span className="text-gray-900 font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Reference No</span>
          <span className="text-gray-800 font-mono font-medium">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Session ID</span>
          <span className="text-gray-800 font-mono text-[10px]">3004857218395728392183</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Date & Time</span>
          <span className="text-gray-700">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Status</span>
          <span className="text-emerald-500 font-black uppercase">COMPLETED</span>
        </div>
      </div>

      <div className="text-[9px] text-gray-300 text-center mt-6 uppercase tracking-widest pt-3">
        ACCESS BANK PLC - SIMULATED BY STYLEHUB
      </div>
    </div>
  );

  // 7. First Bank
  const renderFirstBank = () => (
    <div className="bg-[#0A2540] text-white p-6 font-sans w-full max-w-[400px] border border-blue-900 rounded-lg shadow-sm">
      <div className="flex justify-between items-center border-b border-amber-500 pb-4 mb-4">
        <div>
          <h2 className="text-amber-500 font-black text-lg tracking-wide uppercase">FirstBank</h2>
          <span className="text-[8px] text-gray-300 tracking-wider">Since 1894 - Elephant Trust</span>
        </div>
        <div className="text-[9px] bg-amber-500 text-gray-950 px-2 py-0.5 rounded uppercase font-bold text-center">COMPLETED</div>
      </div>

      <div className="my-5 flex flex-col items-center">
        <span className="text-[10px] text-gray-300 uppercase tracking-widest">Transaction Sum</span>
        <span className="text-2xl font-black text-amber-500 mt-1">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-300">Beneficiary Name</span>
          <span className="text-white font-bold text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-300">Beneficiary Bank</span>
          <span className="text-white font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-300">Originator Account</span>
          <span className="text-white font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-300">Transaction Date</span>
          <span className="text-white/80">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-300">Reference Token</span>
          <span className="text-amber-400 font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-300">Narration</span>
          <span className="text-white/80 italic">{reference}</span>
        </div>
      </div>

      <div className="text-[9px] text-gray-400 text-center mt-6 uppercase tracking-widest pt-3 border-t border-white/5">
        First Bank Nigeria PLC Setup
      </div>
    </div>
  );

  // 8. Zenith Bank
  const renderZenith = () => (
    <div className="bg-white text-gray-850 p-6 font-sans w-full max-w-[400px] border-t-8 border-t-red-600 rounded-lg shadow-sm text-gray-800">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <div>
          <h2 className="text-gray-900 font-black text-xl tracking-tight">ZENITH</h2>
          <span className="text-[8px] text-red-600 font-bold uppercase tracking-wide">Zenith Bank PLC</span>
        </div>
        <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">E-Receipt</span>
      </div>

      <div className="my-5 flex flex-col items-center bg-red-50 py-3 rounded-lg px-4 border-r-4 border-r-red-600">
        <span className="text-[10px] text-red-600 uppercase tracking-widest font-black">Value Settled</span>
        <span className="text-2xl font-black text-red-600 mt-1">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3.5 text-xs text-gray-700">
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Beneficiary</span>
          <span className="text-gray-900 font-bold text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Dest. Bank</span>
          <span className="text-gray-900 font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Sender Account</span>
          <span className="text-gray-900 font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Reference No</span>
          <span className="text-gray-700 font-mono font-bold text-red-600">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Value Date</span>
          <span className="text-gray-700">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1.5">
          <span className="text-gray-400">Remarks</span>
          <span className="text-gray-700 italic">{reference}</span>
        </div>
      </div>

      <div className="text-[8px] text-gray-300 text-center mt-6 uppercase tracking-wider pt-3">
        Zenith Bank Plc - Secure E-Statement
      </div>
    </div>
  );

  // 9. UBA
  const renderUBA = () => (
    <div className="bg-[#1C1C1C] text-white p-6 font-sans w-full max-w-[400px] border-l-8 border-l-red-600 rounded-lg shadow-sm">
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div>
          <span className="text-red-500 text-xl font-bold tracking-wider">UBA</span>
          <p className="text-[8px] text-gray-400">United Bank for Africa</p>
        </div>
        <div className="bg-red-600/10 border border-red-600/30 text-red-500 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">APPROVED</div>
      </div>

      <div className="my-5 flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/5">
        <span className="text-xs text-gray-300">TOTAL PAID</span>
        <span className="text-2xl font-black text-red-500">{formatCurrency(amount)}</span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-400">Recipient Account</span>
          <span className="text-white font-bold text-right">{receiverName}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-400">Receiving Bank</span>
          <span className="text-white font-semibold">{receiverBank}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-400">Sender Nickname</span>
          <span className="text-white font-semibold text-right">{senderName}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-400">Transaction date</span>
          <span className="text-gray-200">{dateTime}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-400">Reference Hash</span>
          <span className="text-gray-200 font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-gray-400">Memo</span>
          <span className="text-white/80">{reference}</span>
        </div>
      </div>

      <div className="text-[9px] text-gray-500 text-center mt-6 uppercase tracking-widest pt-3 border-t border-white/5 animate-pulse">
        UBA LEO ASSISTANT SYSTEMS
      </div>
    </div>
  );

  const getBankReceiptHTML = () => {
    switch (bank.toLowerCase()) {
      case "opay": return renderOPay();
      case "kuda": return renderKuda();
      case "moniepoint": return renderMoniepoint();
      case "palmpay": return renderPalmPay();
      case "gtbank": return renderGTBank();
      case "accessbank":
      case "access bank": return renderAccess();
      case "firstbank":
      case "first bank": return renderFirstBank();
      case "zenith":
      case "zenith bank": return renderZenith();
      case "uba": return renderUBA();
      default: return renderOPay();
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-slate-900/60 p-4 border border-slate-800 rounded-3xl backdrop-blur-md">
      {/* Visual Canvas containing the correct Bank receipt design */}
      <div className="overflow-hidden rounded-xl bg-neutral-900 border border-slate-800 flex justify-center w-full p-2.5 relative">
        <div
          ref={receiptRef}
          className={`${!unlocked ? "blur-md select-none pointer-events-none filter brightness-50 contrast-75" : ""} w-full flex justify-center bg-white rounded-lg`}
        >
          {getBankReceiptHTML()}
        </div>

        {/* Lock Overlay Pane if locked */}
        {!unlocked && (
          <div className="absolute inset-x-2 inset-y-2 flex flex-col justify-center items-center bg-slate-950/75 backdrop-blur-md rounded-xl p-4 text-center border border-cyan-500/20 shadow-2xl">
            <div className="h-10 w-10 rounded-full bg-cyan-950/50 border border-cyan-400/40 flex items-center justify-center text-cyan-400 animate-pulse mb-3.5">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black tracking-widest text-cyan-400 uppercase">RAW WATERMARKED PREVIEW</h4>
            <p className="text-[11px] text-slate-300 mt-2.5 max-w-[270px] leading-relaxed">
              Verify your design variables above. Pay <span className="text-cyan-400 font-bold">10 points</span> to completely lift watermarks, wipe blur, and enable instant Ultra-HD PNG downloads.
            </p>
            <button
              id="unlock-receipt-btn"
              onClick={onUnlock}
              disabled={isLoadingUnlock}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xs font-black text-gray-950 hover:brightness-110 active:scale-95 transition-all text-white flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoadingUnlock ? "Processing Unlock..." : "Unlock Full Receipt (10 PLS)"}
            </button>
          </div>
        )}
      </div>

      {unlocked && (
        <button
          id="download-receipt-png"
          onClick={handleDownloadPNG}
          className="mt-4 py-2.5 px-6 w-full bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-gray-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" /> Download ultra-HD PNG Receipt
        </button>
      )}
    </div>
  );
}
