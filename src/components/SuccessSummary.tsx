import { motion } from "framer-motion";

export function SuccessSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 card-wellness text-center"
    >
      <span className="text-4xl mb-3 block">🎉</span>
      <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
        All meals submitted!
      </h2>
      <p className="text-muted-foreground text-sm">
        Great job tracking your nutrition today. See you tomorrow!
      </p>
    </motion.div>
  );
}
