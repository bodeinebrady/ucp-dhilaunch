import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from 'lucide-react';
import {Loader2Icon} from 'lucide-react';
import {useTheme} from 'next-themes';
import {Toaster as Sonner, type ToasterProps} from 'sonner';

const validThemes = ['dark', 'light', 'system'] as const;

/**
 * A themed toast notification container powered by Sonner. Renders toast notifications
 * with custom icons and theme-aware styling.
 *
 * ### Component Props
 *
 * See [Sonner props](https://sonner.emilkowal.dev/) documentation for full details.
 *
 * | Prop             | Type                                  | Default    |
 * | :--------------- | :------------------------------------ | :--------- |
 * | _theme_          | `"light" \| "dark" \| "system"`       | `"system"` |
 * | _richColors_     | `boolean`                             | `false`    |
 * | _expand_         | `boolean`                             | `false`    |
 * | _duration_       | `number`                              | `4000`     |
 * | _position_       | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "top-center" \| "bottom-center"` | `"bottom-right"` |
 * | _closeButton_    | `boolean`                             | `false`    |
 * | _offset_         | `number \| string`                    | `"32px"`   |
 * | _dir_            | `"ltr" \| "rtl" \| "auto"`            | `"auto"`   |
 *
 * @todo WCAG 4.1.3 – Sonner hardcodes `aria-live="polite"` on its toast container
 * for all toast types. Error and warning toasts should use `aria-live="assertive"`
 * (or `role="alert"`) so screen readers announce them immediately. Sonner does not
 * currently expose a per-type ARIA override via `toastOptions` or any other prop.
 * **Recommended workaround for consumers:** wrap critical error notifications in a
 * custom component that renders its own `role="alert"` live region instead of
 * relying on `toast.error()`.
 *
 * ### Example Usage
 *
 * ```tsx
 * import { toast } from "sonner";
 *
 * <Toaster />
 *
 * // Then trigger toasts anywhere:
 * toast("Event has been created");
 * toast.success("Success!");
 * toast.error("Something went wrong");
 * ```
 */
const Toaster = ({...props}: ToasterProps) => {
  const {theme = 'system'} = useTheme();
  const resolvedTheme = validThemes.find(t => t === theme) ?? 'system';

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="size-4" />,
        info: <Info className="size-4" />,
        warning: <AlertTriangle className="size-4" />,
        error: <OctagonAlert className="size-4" />,

        // TODO - there is no exact match for Lucide's Loader2Icon in untitledui
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export {Toaster};
