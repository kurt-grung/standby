import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type OutlineGlassFrame = {
  width: number;
  height: number;
  borderRadius: number;
  top: number;
  left: number;
};

export function appOutlineGlassFrame(
  containerWidth: number,
  containerHeight: number,
  inset: number,
): OutlineGlassFrame {
  const width = Math.max(0, containerWidth - inset);
  const height = Math.max(0, containerHeight - inset);

  return {
    width,
    height,
    borderRadius: height / 2,
    top: (containerHeight - height) / 2,
    left: (containerWidth - width) / 2,
  };
}

export function appOutlineGlassFrameStyle(frame: OutlineGlassFrame): ViewStyle {
  return {
    position: 'absolute',
    top: frame.top,
    left: frame.left,
    width: frame.width,
    height: frame.height,
    borderRadius: frame.borderRadius,
  };
}

export function centeredCircleOutlineStyle(containerSize: number, outlineSize: number): ViewStyle {
  const offset = (containerSize - outlineSize) / 2;
  return { top: offset, left: offset };
}

export function centeredOutlineStyle(
  containerWidth: number,
  containerHeight: number,
  outlineWidth: number,
  outlineHeight: number,
): ViewStyle {
  return {
    top: (containerHeight - outlineHeight) / 2,
    left: (containerWidth - outlineWidth) / 2,
  };
}

type OutlineShapeProps = {
  width: number;
  height: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor: string;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

export function derivePillOutlineSize(pillWidth: number, pillHeight: number, inset: number) {
  const height = Math.max(0, pillHeight - inset);
  const width = Math.max(0, pillWidth - inset);
  return { width, height, borderRadius: height / 2 };
}

export function deriveCircleOutlineSize(diameter: number, inset: number) {
  const size = Math.max(0, diameter - inset);
  return { size, width: size, height: size, borderRadius: size / 2 };
}

export function OutlineShape({
  width,
  height,
  borderRadius = height / 2,
  borderWidth = 1,
  borderColor,
  opacity = 1,
  style,
}: OutlineShapeProps) {
  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          borderWidth,
          borderColor,
          opacity,
        },
        style,
      ]}
    />
  );
}

type CircleOutlineProps = Omit<OutlineShapeProps, 'width' | 'height' | 'borderRadius'> & {
  size: number;
};

export function CircleOutline({ size, ...rest }: CircleOutlineProps) {
  return <OutlineShape width={size} height={size} borderRadius={size / 2} {...rest} />;
}

type PillOutlineProps = OutlineShapeProps;

export function PillOutline(props: PillOutlineProps) {
  return <OutlineShape {...props} />;
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});
