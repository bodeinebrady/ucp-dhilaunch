import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

import {cn} from '../../lib/utils';
import {Button} from './button';

type StepIndicatorProps = {
  /** Total number of steps. */
  steps: number;
  /** The current active step (1-based). */
  currentStep: number;
  /**
   * Display variant.
   * - `"default"` — numbered circles with connectors (Stepper)
   * - `"dots"` — minimal dot indicators (MobileStepper)
   *
   * @default "default"
   */
  variant?: 'default' | 'dots';
  /**
   * Show previous/next navigation buttons (dots variant only).
   *
   * @default false
   */
  showNavigation?: boolean;
  /** Called when the user clicks Previous. */
  onPrevious?: () => void;
  /** Called when the user clicks Next. */
  onNext?: () => void;
  className?: string;
};

/**
 * A step progress indicator. Replaces both `@mui/material/Stepper` and
 * `@mui/material/MobileStepper`.
 *
 * ### Component Props
 *
 * | Prop              | Type                      | Default     |
 * | :---------------- | :------------------------ | :---------- |
 * | _steps_           | `number`                  | **required**|
 * | _currentStep_     | `number` (1-based)        | **required**|
 * | _variant_         | `"default" \| "dots"`     | `"default"` |
 * | _showNavigation_  | `boolean`                 | `false`     |
 * | _onPrevious_      | `() => void`              | -           |
 * | _onNext_          | `() => void`              | -           |
 *
 * ### Example Usage
 *
 * **Numbered stepper**
 * ```tsx
 * <StepIndicator steps={4} currentStep={2} />
 * ```
 *
 * **Dot stepper with navigation**
 * ```tsx
 * <StepIndicator
 *   variant="dots"
 *   steps={5}
 *   currentStep={3}
 *   showNavigation
 *   onPrevious={() => setStep(s => s - 1)}
 *   onNext={() => setStep(s => s + 1)}
 * />
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 1.3.1 Info and Relationships — each step has an aria-label with its position and state.
 * @wcag 4.1.2 Name, Role, Value — uses role="img" with descriptive labels per step.
 */
const StepIndicator = ({
  steps,
  currentStep,
  variant = 'default',
  showNavigation = false,
  onPrevious,
  onNext,
  className,
}: StepIndicatorProps) => {
  if (variant === 'dots') {
    return (
      <div
        data-slot="step-indicator"
        data-variant="dots"
        className={cn('flex items-center gap-3', className)}
      >
        {showNavigation && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onPrevious}
            disabled={currentStep <= 1}
            aria-label="Previous step"
          >
            <ChevronLeft />
          </Button>
        )}
        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label={`Step ${currentStep} of ${steps}`}
        >
          {Array.from({length: steps}, (_, i) => {
            const step = i + 1;
            const isActive = step === currentStep;
            const isComplete = step < currentStep;
            return (
              <span
                key={step}
                aria-hidden
                className={cn(
                  'size-2 rounded-full transition-colors',
                  isActive && 'bg-primary',
                  isComplete && 'bg-primary/40',
                  !isActive && !isComplete && 'bg-border'
                )}
              />
            );
          })}
        </div>
        {showNavigation && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onNext}
            disabled={currentStep >= steps}
            aria-label="Next step"
          >
            <ChevronRight />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="step-indicator"
      data-variant="default"
      className={cn('flex items-center gap-2', className)}
    >
      {Array.from({length: steps}, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isComplete = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            <span
              role="img"
              aria-label={`Step ${step} of ${steps}${isComplete ? ', completed' : isActive ? ', current' : ''}`}
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                isActive && 'bg-primary text-primary-foreground',
                isComplete && 'bg-primary/20 text-primary',
                !isActive && !isComplete && 'bg-muted text-muted-foreground'
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="size-3.5" aria-hidden />
              ) : (
                step
              )}
            </span>
            {i < steps - 1 && (
              <div
                className={cn(
                  'h-px w-8',
                  step < currentStep ? 'bg-primary/40' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export {StepIndicator};
export type {StepIndicatorProps};
