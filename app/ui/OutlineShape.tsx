import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

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
