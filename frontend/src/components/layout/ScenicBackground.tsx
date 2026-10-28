import { useState, type ReactNode } from "react";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../theme/ThemeProvider";

type Props = {
  children: ReactNode;
  height?: number;
};

const LANDSCAPE_URL =
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85";

export default function ScenicBackground({
  children,
  height = 250,
}: Props) {
  const { isDark, colors } = useAppTheme();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!imageFailed && (
        <Image
          source={{ uri: LANDSCAPE_URL }}
          style={[styles.image, { height }]}
          contentFit="cover"
          cachePolicy="disk"
          transition={250}
          onError={() => setImageFailed(true)}
          accessibilityLabel="Scenic mountain landscape"
        />
      )}

      <View
        pointerEvents="none"
        style={[
          styles.overlay,
          {
            height,
            backgroundColor: isDark
              ? "rgba(17,16,40,0.56)"
              : "rgba(239,233,255,0.24)",
          },
        ]}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
