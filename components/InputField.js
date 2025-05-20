import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error = null,
  leftIcon = null,
  required = false,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
}) => {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const getContainerStyles = () => {
    let containerStyle = [styles.container];

    if (error) {
      containerStyle.push(styles.errorContainer);
    } else if (focused) {
      containerStyle.push(styles.focusedContainer);
    }

    if (!editable) {
      containerStyle.push(styles.disabledContainer);
    }

    return containerStyle;
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <View style={getContainerStyles()}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            secureTextEntry && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !passwordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeOff size={20} color={Colors.neutral[500]} />
            ) : (
              <Eye size={20} color={Colors.neutral[500]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  required: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.error[500],
    marginLeft: Spacing.xs / 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Spacing.radius.md,
    backgroundColor: Colors.background,
  },
  focusedContainer: {
    borderColor: Colors.primary[500],
  },
  errorContainer: {
    borderColor: Colors.error[500],
  },
  disabledContainer: {
    backgroundColor: Colors.neutral[100],
    borderColor: Colors.neutral[300],
  },
  leftIconContainer: {
    paddingLeft: Spacing.md,
  },
  rightIconContainer: {
    paddingRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.sm,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  errorText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.error[500],
    marginTop: Spacing.xs,
  },
});

export default InputField;
