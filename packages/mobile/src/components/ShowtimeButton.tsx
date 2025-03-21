import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface ShowtimeButtonProps {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export default function ShowtimeButton({
  time,
  selected = false,
  disabled = false,
  onPress,
}: ShowtimeButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.time,
          selected && styles.selectedText,
          disabled && styles.disabledText,
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  time: {
    ...typography.body,
    color: colors.text,
  },
  selectedText: {
    color: colors.text,
    fontWeight: '600',
  },
  disabledText: {
    color: colors.textSecondary,
  },
}); 