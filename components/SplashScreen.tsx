import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 2 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Icon Background */}
        <View style={styles.appIcon}>
          {/* Utensils in Background */}
          <View style={[styles.utensil, styles.fork]} />
          <View style={[styles.utensil, styles.knife]} />

          {/* Bear Face */}
          <View style={styles.bearFace}>
            {/* Ears */}
            <View style={[styles.ear, styles.earLeft]} />
            <View style={[styles.ear, styles.earRight]} />

            {/* Face Base */}
            <View style={styles.faceBase}>
              {/* Eyes */}
              <View style={[styles.eye, styles.eyeLeft]} />
              <View style={[styles.eye, styles.eyeRight]} />

              {/* Muzzle */}
              <View style={styles.muzzle}>
                <View style={styles.nose} />
              </View>
            </View>
          </View>

          {/* Chef Hat */}
          <View style={styles.chefHat} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEAD2B", // Primary yellow
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 220,
    height: 220,
  },
  appIcon: {
    width: 220,
    height: 220,
    backgroundColor: "#F5B82E",
    borderRadius: 50,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 35,
    elevation: 15,
  },

  // Utensils
  utensil: {
    position: "absolute",
    top: "25%",
    width: 15,
    height: 100,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 5,
  },
  fork: {
    left: 30,
  },
  knife: {
    right: 30,
  },

  // Bear Face
  bearFace: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -77, // Half of width for centering
    width: 154,
    height: 132,
  },
  faceBase: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FF7B22", // Bear orange
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    position: "relative",
    zIndex: 2,
  },

  // Ears
  ear: {
    width: 45,
    height: 45,
    backgroundColor: "#FF7B22",
    borderRadius: 22.5,
    position: "absolute",
    top: -10,
  },
  earLeft: {
    left: 0,
  },
  earRight: {
    right: 0,
  },

  // Eyes
  eye: {
    width: 12,
    height: 12,
    backgroundColor: "#333",
    borderRadius: 6,
    position: "absolute",
    top: 40,
  },
  eyeLeft: {
    left: 35,
  },
  eyeRight: {
    right: 35,
  },

  // Muzzle
  muzzle: {
    width: 80,
    height: 55,
    backgroundColor: "white",
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    left: "50%",
    marginLeft: -40, // Half of width for centering
  },
  nose: {
    width: 18,
    height: 12,
    backgroundColor: "#333",
    borderRadius: 8,
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
    alignSelf: "center",
  },

  // Chef Hat
  chefHat: {
    width: 65,
    height: 35,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    position: "absolute",
    top: 55,
    left: "50%",
    marginLeft: -32.5, // Half of width for centering
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
