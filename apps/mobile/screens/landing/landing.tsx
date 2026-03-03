import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import GoldButton from "@/components/GoldButton";
import { Colors, Spacing, Fonts, BorderRadius } from "@/constants/theme";

export default function LandingScreen() {
  const router = useRouter();
  const [adventure, setAdventure] = useState("");
  const orbAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orb pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(orbAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBeginAdventure = () => {
    if (adventure.trim()) {
      router.push({
        pathname: "/register",
        params: { adventure: adventure.trim() },
      });
    }
  };

  return (
    <LinearGradient
      colors={[Colors.bgDark, "#121832", Colors.bgDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <Animated.View
            style={[styles.orbContainer, { transform: [{ scale: orbAnim }] }]}
          >
            <LinearGradient
              colors={[Colors.accentGold, Colors.accentGoldDim, "transparent"]}
              style={styles.orb}
              start={{ x: 0.3, y: 0.3 }}
              end={{ x: 0.8, y: 0.8 }}
            >
              <Text style={styles.orbIcon}>⚔</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.textContent, { opacity: fadeAnim }]}>
            <Text style={styles.title}>LifeQuest</Text>
            <Text style={styles.subtitle}>
              Turn your goals into epic adventures.{"\n"}
              Complete quests. Earn rewards. Level up.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>YOUR ADVENTURE AWAITS</Text>
              <TextInput
                style={styles.input}
                placeholder='e.g. "Get an A in Physics"'
                placeholderTextColor={Colors.textMuted}
                value={adventure}
                onChangeText={setAdventure}
                returnKeyType="go"
                onSubmitEditing={handleBeginAdventure}
              />
            </View>

            <GoldButton
              title="BEGIN ADVENTURE →"
              onPress={handleBeginAdventure}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already on a quest? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xxl,
  },
  orbContainer: {
    marginBottom: 30,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 10,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  orbIcon: {
    fontSize: 40,
  },
  textContent: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontFamily: Fonts.headingBlack,
    fontSize: 28,
    color: Colors.accentGold,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: Fonts.heading,
    fontSize: 11,
    color: Colors.accentGoldDim,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: "rgba(245,182,66,0.2)",
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  footerLink: {
    fontSize: 12,
    color: Colors.accentGoldDim,
    fontFamily: Fonts.bodySemiBold,
  },
});
