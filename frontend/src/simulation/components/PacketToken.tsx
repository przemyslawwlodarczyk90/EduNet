import { motion } from "framer-motion";

const BAND_HEIGHT = 56;
const BAND_GAP = 8;

interface PacketTokenProps {
  bandIndex: number | null;
}

export function PacketToken({ bandIndex }: PacketTokenProps) {
  if (bandIndex === null) return null;

  const top = bandIndex * (BAND_HEIGHT + BAND_GAP) + BAND_HEIGHT / 2;

  return (
    <motion.div
      className="packet-token"
      initial={false}
      animate={{ top, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      title="Pakiet"
    >
      📦
    </motion.div>
  );
}

export { BAND_HEIGHT, BAND_GAP };
