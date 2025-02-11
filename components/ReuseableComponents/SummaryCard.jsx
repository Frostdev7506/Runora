import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Title, Paragraph } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const SummaryCard = ({ iconName, title, value, symbol, opacity = 1 }) => {
  // Animation setup
  const scaleAnim = new Animated.Value(0.95);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#2193b0', '#6dd5ed']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Icon name={iconName} size={32} color="#ffffff" />
            </View>
            <Title style={styles.cardTitle}>{title}</Title>
          </View>
          
          <View style={styles.valueContainer}>
            <Paragraph style={styles.symbol}>{symbol}</Paragraph>
            <Paragraph style={styles.value}>{value}</Paragraph>
          </View>

          {/* Optional trend indicator */}
          <View style={styles.trendContainer}>
            <Icon name="arrow-up" size={12} color="#ffffff" />
            <Paragraph style={styles.trendText}>2.5%</Paragraph>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width - 40   ,
    marginHorizontal: 2,
    marginVertical: 8,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    backgroundColor: 'transparent',
  },
  gradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    minHeight: 120,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  symbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 4,
    opacity: 0.9,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 4,
    opacity: 0.9,
  },
});

export default SummaryCard;