import { motion } from "framer-motion";

export function WelcomeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
        Let's log your meals for today
      </h1>
      <p className="text-muted-foreground">
        Track your breakfast, lunch, dinner, and snacks — and how they made you
        feel.
      </p>
    </motion.div>
  );
}
