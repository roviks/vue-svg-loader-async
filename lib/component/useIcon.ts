import { IconProps } from "./icon.types";
import {
  computed,
  CSSProperties,
  defineAsyncComponent,
  type Component,
} from "vue";
import {
  ICON_METADATA,
  IconMetadata,
  importIcon,
} from "virtual:vue-svg-icons/generated";

export const useIcon = (props: IconProps) => {
  const name = computed(() => props.name);
  const size = computed(() => props.size);
  const color = computed(() => props.color);
  const cssVars = computed(() => props.cssVars);
  const label = computed(() => props.label);
  const decorative = computed(() => props.decorative);

  const createIconComponent = (iconName: string): Component =>
    defineAsyncComponent({
      loader: async () => {
        if (ICON_METADATA && !(iconName in ICON_METADATA)) {
          console.warn(`[vue-svg-icons] Icon not found: "${iconName}"`);
          return { default: { render: () => null } };
        }
        try {
          return await importIcon(iconName);
        } catch (err) {
          console.warn(`[vue-svg-icons] Failed to load icon: "${iconName}"`, err);
          return { default: { render: () => null } };
        }
      },
      errorComponent: { render: () => null },
    });

  const cache = new Map<string, Component>();

  const IconComponent = computed<Component>(() => {
    if (!cache.has(name.value)) cache.set(name.value, createIconComponent(name.value));
    return cache.get(name.value)!;
  });

  const metadata = computed<IconMetadata>(
    () => ICON_METADATA?.[name.value] || null,
  );

  const iconStyles = computed<CSSProperties>(() => {
    const styles: CSSProperties = {
      width: typeof size.value === "number" ? `${size.value}px` : size.value,
      height: typeof size.value === "number" ? `${size.value}px` : size.value,
      color: color.value,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
    };

    if (cssVars.value && metadata.value?.hasMultipleColors) {
      Object.entries(cssVars.value).forEach(([key, value]) => {
        styles[`--icon-${key}`] = value;
      });
    }

    return styles;
  });

  const ariaAttrs = computed<Record<string, unknown>>(() => {
    if (decorative.value) {
      return {
        "aria-hidden": true,
        role: "presentation",
      };
    }

    return {
      role: "img",
      "aria-label": label.value || `${name.value} icon`,
    };
  });

  return {
    IconComponent,
    iconStyles,
    ariaAttrs,
    metadata
  };
};
