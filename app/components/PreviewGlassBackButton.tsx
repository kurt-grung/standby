import { Link } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

const iconTint = '#FFFFFF';
const buttonSize = 56;
const iconSize = 26;

export function PreviewGlassBackButton() {
  return (
    <Link href="/" asChild>
      <Pressable accessibilityRole="button" accessibilityLabel="Home">
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          colorScheme="dark"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SymbolView name="chevron.left" size={iconSize} tintColor={iconTint} weight="semibold" />
        </GlassView>
      </Pressable>
    </Link>
  );
}
