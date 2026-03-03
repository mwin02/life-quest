import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Fonts, BorderRadius, Spacing } from "../../constants/theme";
import GoldButton from "../../components/GoldButton";

const avatars = [
  { icon: "🧙", bg: "#1E2A45" },
  { icon: "⚔️", bg: "#2A1E35" },
  { icon: "🏹", bg: "#1E3530" },
  { icon: "🛡️", bg: "#352A1E" },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { adventure = "" } = useLocalSearchParams<{ adventure?: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(1);

  const handleCreateHero = () => {
    router.push({
      pathname: "/agent-chat",
      params: {
        adventure,
        heroName: name,
        avatar: avatars[selectedAvatar].icon,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Your Hero</Text>
          <Text style={styles.subtitle}>
            Set up your account to begin your adventure
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>HERO NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>CHOOSE YOUR AVATAR</Text>
          </View>

          <View style={styles.avatarRow}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  { backgroundColor: avatar.bg },
                  selectedAvatar === index && styles.avatarSelected,
                ]}
                onPress={() => setSelectedAvatar(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.avatarIcon}>{avatar.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomSection}>
            <GoldButton title="CREATE HERO" onPress={handleCreateHero} />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  back: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  avatarRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  avatarOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  avatarSelected: {
    borderColor: Colors.accentGold,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarIcon: {
    fontSize: 22,
  },
  bottomSection: {
    marginTop: "auto",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  socialText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
