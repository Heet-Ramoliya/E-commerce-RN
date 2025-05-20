import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'text'
  size = 'medium', // 'small', 'medium', 'large'
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    let buttonStyle = [styles.button];
    
    // Add variant styles
    switch (variant) {
      case 'primary':
        buttonStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        buttonStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        buttonStyle.push(styles.outlineButton);
        break;
      case 'text':
        buttonStyle.push(styles.textButton);
        break;
      default:
        buttonStyle.push(styles.primaryButton);
    }
    
    // Add size styles
    switch (size) {
      case 'small':
        buttonStyle.push(styles.smallButton);
        break;
      case 'large':
        buttonStyle.push(styles.largeButton);
        break;
      default:
        // Medium is default, no additional styles needed
        break;
    }
    
    // Add full width style
    if (fullWidth) {
      buttonStyle.push(styles.fullWidth);
    }
    
    // Add disabled style
    if (disabled || loading) {
      buttonStyle.push(styles.disabledButton);
    }
    
    return buttonStyle;
  };
  
  const getTextStyles = () => {
    let textStyles = [styles.buttonText];
    
    // Add variant text styles
    switch (variant) {
      case 'primary':
        textStyles.push(styles.primaryButtonText);
        break;
      case 'secondary':
        textStyles.push(styles.secondaryButtonText);
        break;
      case 'outline':
        textStyles.push(styles.outlineButtonText);
        break;
      case 'text':
        textStyles.push(styles.textButtonText);
        break;
      default:
        textStyles.push(styles.primaryButtonText);
    }
    
    // Add size text styles
    switch (size) {
      case 'small':
        textStyles.push(styles.smallButtonText);
        break;
      case 'large':
        textStyles.push(styles.largeButtonText);
        break;
      default:
        // Medium is default, no additional styles needed
        break;
    }
    
    // Add disabled text style
    if (disabled || loading) {
      textStyles.push(styles.disabledButtonText);
    }
    
    return textStyles;
  };
  
  const getLoaderColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.text.inverse;
      case 'secondary':
        return Colors.text.inverse;
      case 'outline':
        return Colors.primary[600];
      case 'text':
        return Colors.primary[600];
      default:
        return Colors.text.inverse;
    }
  };
  
  return (
    <TouchableOpacity
      style={[...getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {leftIcon && !loading && leftIcon}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getLoaderColor()} 
          style={styles.loader} 
        />
      ) : (
        <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
      )}
      
      {rightIcon && !loading && rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary[600],
  },
  secondaryButton: {
    backgroundColor: Colors.secondary[600],
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  smallButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.radius.sm,
  },
  largeButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: Colors.text.inverse,
  },
  secondaryButtonText: {
    color: Colors.text.inverse,
  },
  outlineButtonText: {
    color: Colors.primary[600],
  },
  textButtonText: {
    color: Colors.primary[600],
  },
  smallButtonText: {
    fontSize: Typography.sizes.sm,
  },
  largeButtonText: {
    fontSize: Typography.sizes.lg,
  },
  disabledButtonText: {
    // No specific changes needed, opacity is handled at the button level
  },
  loader: {
    marginRight: 0,
  },
});

export default Button;