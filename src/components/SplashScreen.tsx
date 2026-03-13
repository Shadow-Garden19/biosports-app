import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { Logo } from './Logo';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const SPLASH_DURATION_MS = 2500;
const FADE_IN_MS = 600;
const FADE_OUT_MS = 500;

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Écran de lancement (splash) : logo centré, animation fluide 2–3 s,
 * fond sombre, logo avec transparence préservée. App + Web.
 */
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fadeIn = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_IN_MS,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: FADE_IN_MS,
        useNativeDriver: true,
      }),
    ]);

    const fadeOut = Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: FADE_OUT_MS,
      useNativeDriver: true,
    });

    const timer = setTimeout(() => {
      fadeOut.start(({ finished }) => {
        if (finished) onFinish();
      });
    }, SPLASH_DURATION_MS);

    fadeIn.start();

    return () => clearTimeout(timer);
  }, [onFinish, opacity, scale, overlayOpacity]);

  return (
    <Animated.View
      style={[styles.container, { opacity: overlayOpacity }]}
      pointerEvents="box-none"
    >
      <View style={styles.background} />
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Logo size="large" showSlogan={true} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      position: 'fixed' as any,
      width: '100vw' as any,
      height: '100vh' as any,
    }),
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
