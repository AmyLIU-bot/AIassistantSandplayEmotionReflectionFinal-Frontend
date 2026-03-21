import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, MousePointerClick, Move, Layers, Palette, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "sandbox_onboarding_completed";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: "canvas" | "objectbar" | "toolbar" | "terrain" | null;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to the Sandbox",
    description: "This is your creative space to express emotions by placing objects and building a scene. No words needed — just let your hands guide you.",
    icon: <Sparkles className="w-6 h-6" />,
    highlight: null,
  },
  {
    title: "Object Bar",
    description: "Browse categories like People, Nature, Animals, and more. Each category contains objects you can drag onto the canvas.",
    icon: <MousePointerClick className="w-6 h-6" />,
    highlight: "objectbar",
  },
  {
    title: "Control Bar",
    description: "Use Undo, Redo, and Clear to manage your scene. When you're ready, click Finish to receive your AI reflection.",
    icon: <CheckCircle2 className="w-6 h-6" />,
    highlight: "toolbar",
  },
  {
    title: "Terrain Styles",
    description: "Change the sandbox terrain — choose from Flat, Dune, Basin, and more to shape the landscape of your inner world.",
    icon: <Layers className="w-6 h-6" />,
    highlight: "terrain",
  },
  {
    title: "Drag & Place Objects",
    description: "Drag any object from the bar onto the 3D canvas. Place them wherever feels right to you.",
    icon: <Move className="w-6 h-6" />,
    highlight: "canvas",
  },
  {
    title: "Edit Your Objects",
    description: "Click on any placed object to select it. You can rotate, scale, raise/lower, move, or delete objects using the controls that appear.",
    icon: <Palette className="w-6 h-6" />,
    highlight: "canvas",
  },
];

export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function SandboxOnboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(ONBOARDING_KEY, "true");
      setVisible(false);
      setTimeout(onComplete, 300);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setVisible(false);
    setTimeout(onComplete, 300);
  };

  // Highlight positions
  const getHighlightStyle = (): React.CSSProperties => {
    switch (step.highlight) {
      case "canvas":
        return { top: 12, left: 12, right: "35%", bottom: "35%" };
      case "objectbar":
        return { bottom: 0, left: 0, right: "35%", height: 110 };
      case "toolbar":
        return { bottom: 110, left: 0, right: "35%", height: 48 };
      case "terrain":
        return { top: 12, right: "35%", width: 56, height: 320 };
      default:
        return { display: "none" };
    }
  };

  // Tooltip position
  const getTooltipPosition = (): string => {
    switch (step.highlight) {
      case "objectbar":
        return "bottom-32 left-1/2 -translate-x-1/2";
      case "toolbar":
        return "bottom-44 left-1/2 -translate-x-1/2";
      case "terrain":
        return "top-1/2 right-[38%] -translate-y-1/2";
      case "canvas":
        return "top-1/3 left-[15%]";
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100]"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" />

          {/* Highlight cutout */}
          {step.highlight && (
            <motion.div
              key={step.highlight}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute rounded-2xl border-2 border-primary/60 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              style={{
                ...getHighlightStyle(),
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.0), inset 0 0 0 0 transparent",
              }}
            >
              <div className="absolute inset-0 rounded-2xl animate-pulse border border-primary/30" />
            </motion.div>
          )}

          {/* Tooltip card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`absolute ${getTooltipPosition()} w-[340px] z-[101]`}
          >
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-5 space-y-3">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {currentStep + 1} / {steps.length}
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? "w-6 bg-primary"
                        : i < currentStep
                        ? "w-1.5 bg-primary/40"
                        : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleSkip}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip tutorial
                </button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1.5 rounded-lg"
                >
                  {isLast ? "Get Started" : "Next"}
                  {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
