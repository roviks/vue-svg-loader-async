import { IconProps } from "./icon.types";
import {
  computed,
  CSSProperties,
  defineAsyncComponent,
  toRef,
  type Component,
} from "vue";
import {
  ICON_METADATA,
  IconMetadata,
  importIcon,
} from "virtual:vue-svg-icons/generated";

export const useIcon = (props: IconProps) => {
  const name = toRef(props, "name");

  const IconComponent = computed<Component>(() => {
    return defineAsyncComponent({
      loader: () => importIcon(name.value),
      onError(_err, _retry, fail) {
        console.warn(`[vue-svg-icons] Icon not found: "${name.value}"`);
        fail();
      },
      errorComponent: { render: () => null },
    });
  });

  const metadata = computed<IconMetadata>(
    () => ICON_METADATA?.[props.name] || null,
  );

  const iconStyles = computed<CSSProperties>(() => {
    const styles: CSSProperties = {
      width: typeof props.size === "number" ? `${props.size}px` : props.size,
      height: typeof props.size === "number" ? `${props.size}px` : props.size,
      color: props.color,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
    };

    if (props.cssVars && metadata.value?.hasMultipleColors) {
      Object.entries(props.cssVars).forEach(([key, value]) => {
        styles[`--icon-${key}`] = value;
      });
    }

    return styles;
  });

  const ariaAttrs = computed<Record<string, unknown>>(() => {
    if (props.decorative) {
      return {
        "aria-hidden": true,
        role: "presentation",
      };
    }

    return {
      role: "img",
      "aria-label": props.label || `${props.name} icon`,
    };
  });

  return {
    IconComponent,
    iconStyles,
    ariaAttrs,
    metadata
  };
};
