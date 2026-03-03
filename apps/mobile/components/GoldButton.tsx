import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, BorderRadius } from '../constants/theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
}

export default function GoldButton({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
}: GoldButtonProps) {
  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        style={[styles.secondaryBtn, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.secondaryText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={[Colors.goldGradientStart, Colors.goldGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  text: {
    fontFamily: Fonts.heading,
    fontSize: 14,
    color: Colors.bgDark,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
