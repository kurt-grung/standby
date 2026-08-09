import { Link } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

const iconTint = '#FFFFFF';

export function PreviewGlassBackButton() {
  return (
    <Link href="/" asChild>
      <Pressable accessibilityRole="button" accessibilityLabel="Home">
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          colorScheme="dark"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SymbolView name="chevron.left" size={20} tintColor={iconTint} weight="semibold" />
        </GlassView>
      </Pressable>
    </Link>
  );
}
