import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => (
  <a
    href="https://wa.me/8801576716992"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-pulse-glow"
  >
    <MessageCircle size={26} fill="white" />
    <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
  </a>
);

export default WhatsAppFloat;
