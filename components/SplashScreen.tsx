import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

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
    width: 200,
    height: 200,
  },
  appIcon: {
    width: 200,
    height: 200,
    backgroundColor: "#EEAD2B",
    borderRadius: 45,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
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
    marginLeft: -70, // Half of width for centering
    width: 140,
    height: 120,
  },
  faceBase: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FF7B22", // Bear orange
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
