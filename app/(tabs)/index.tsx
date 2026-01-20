import { Image } from 'expo-image';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const CAROUSEL_DATA = [
  {
    id: '1',
    title: 'ଉତ୍କଳ ଉଦୟ\nଉନ୍ନତ ଚୁଲି ପ୍ରକଳ୍ପ',
    subtitle: 'ମିନସୁ ଇଣ୍ଡିଆ ପ୍ରାଇଭେଟ୍ ଲିମିଟେଡ୍',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    title: 'ସ୍ୱଚ୍ଛ ପରିବେଶ\nଉତ୍ତମ ଜୀବନ',
    subtitle: 'ଉତ୍କଳ ଉଦୟ ପଦକ୍ଷେପ',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '3',
    title: 'ସୁସ୍ଥ ପରିବାର\nଉନ୍ନତ ଓଡ଼ିଶା',
    subtitle: 'ସୁସ୍ଥ ପରିବାର, ଉନ୍ନତ ଓଡ଼ିଶା',
    image: 'https://images.unsplash.com/photo-1542601906970-3c10f3c50974?auto=format&fit=crop&q=80&w=1000',
  },
];

export default function HomeScreen() {
  // const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weather, setWeather] = useState({ temp: '--', city: 'Loading...', icon: '' });
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Mock weather fetch & Auto-play logic
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setWeather(prev => ({ ...prev, city: 'Access Denied' }));
          return;
        }

        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          setWeather({
            temp: '25°C',
            city: 'Sambalpur (Default)',
            icon: 'https://openweathermap.org/img/wn/01d@2x.png'
          });
          return;
        }

        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setWeather({
          temp: '25°C',
          city: 'Sambalpur, Odisha',
          icon: 'https://openweathermap.org/img/wn/01d@2x.png'
        });
      } catch (error) {
        console.warn('Location error:', error);
        setWeather({
          temp: '25°C',
          city: 'Sambalpur (Static)',
          icon: 'https://openweathermap.org/img/wn/01d@2x.png'
        });
      }
    })();

    // Auto-play interval
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % CAROUSEL_DATA.length;
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderCarouselItem = ({ item }: { item: typeof CAROUSEL_DATA[0] }) => (
    <View style={styles.carouselItem}>
      <View style={styles.cardContainer}>
        <Image source={item.image} style={styles.carouselImage} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.carouselOverlay}
        >
          <View style={styles.carouselContent}>
            <View style={styles.tagPill}>
              <Ionicons name="leaf" size={12} color="#7FFF00" />
              <Text style={styles.tagText}>ସ୍ୱଚ୍ଛ ଶକ୍ତି</Text>
            </View>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dynamic Hero Section */}
        <LinearGradient
          colors={['#FF8C00', '#FF4500']}
          style={styles.heroSection}
        >
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroBranding}>ଉତ୍କଳ ଉଦୟ</Text>
              <Text style={styles.heroGreeting}>ନମସ୍କାର</Text>
            </View>
            <View style={styles.heroIcons}>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="notifications-outline" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="person-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Integrated Weather Pill */}
          <View style={styles.weatherPill}>
            <Ionicons name="location-sharp" size={14} color="#FFF" />
            <Text style={styles.weatherPillText}>{weather.city} • {weather.temp}</Text>
          </View>
        </LinearGradient>

        {/* Poster Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={CAROUSEL_DATA}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            snapToInterval={width - 40}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setActiveIndex(Math.round(x / (width - 40)));
            }}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />

          {/* External Pagination Dots */}
          <View style={styles.externalPagination}>
            {CAROUSEL_DATA.map((_, i) => (
              <View
                key={i}
                style={[styles.paginationDot, activeIndex === i && styles.paginationDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Marquee Ticker */}
        <View style={styles.tickerContainer}>
          <Text style={styles.tickerText}>
            ଉତ୍କଳ ଉଦୟ ଉନ୍ନତ ଚୁଲି ପ୍ରକଳ୍ପ ସମ୍ବଲପୁର, ଓଡ଼ିଶା । ସ୍ୱଚ୍ଛ ଇନ୍ଧନ, ସୁସ୍ଥ ଜୀବନ ।
          </Text>
        </View>

        {/* Bahni Stove Spotlight Section */}
        <View style={styles.stoveSpotlight}>
          <View style={styles.stoveHeader}>
            <Text style={styles.productName}>“ବହ୍ନି” ଉନ୍ନତ ଚୁଲି</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ସକ୍ରିୟ</Text>
            </View>
          </View>

          <Text style={styles.productTagline}>ଆପଣଙ୍କର ସ୍ୱଚ୍ଛ ରୋଷେଇ ସାଥୀ</Text>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.statBox}>
              <Ionicons name="leaf-outline" size={24} color="#2E7D32" />
              <Text style={styles.statValue}>12.5 କି.ଗ୍ରା</Text>
              <Text style={styles.statLabel}>CO2 ବଞ୍ଚାଗଲା</Text>
            </LinearGradient>
            <LinearGradient colors={['#FFF3E0', '#FFE0B2']} style={styles.statBox}>
              <Ionicons name="flame-outline" size={24} color="#E65100" />
              <Text style={styles.statValue}>32%</Text>
              <Text style={styles.statLabel}>ଦକ୍ଷତା</Text>
            </LinearGradient>
            <LinearGradient colors={['#E1F5FE', '#B3E5FC']} style={styles.statBox}>
              <Ionicons name="timer-outline" size={24} color="#0277BD" />
              <Text style={styles.statValue}>48ଘଣ୍ଟା</Text>
              <Text style={styles.statLabel}>ବ୍ୟବହାର</Text>
            </LinearGradient>
          </View>

          {/* Action Grid */}
          <Text style={styles.subSectionTitle}>ତୁରନ୍ତ କାର୍ଯ୍ୟ</Text>
          <View style={styles.actionGrid}>
            {[
              { title: 'ସମସ୍ୟା ଜଣାନ୍ତୁ', icon: 'alert-circle-outline', color: '#FF5252' },
              { title: 'ମରାମତି ଅନୁରୋଧ', icon: 'construct-outline', color: '#FFA000' },
              { title: 'ବ୍ୟବହାର ନିର୍ଦ୍ଦେଶିକା', icon: 'book-outline', color: '#448AFF' },
              { title: 'ଉପକାରିତା', icon: 'shield-checkmark-outline', color: '#4CAF50' },
            ].map((action, idx) => (
              <TouchableOpacity key={idx} style={styles.actionItem}>
                <View style={[styles.actionIconRing, { borderColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.registerBtn} activeOpacity={0.8}>
            <LinearGradient
              colors={['#008000', '#006400']}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.registerText}>ସହାୟତା ପାଆନ୍ତୁ</Text>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" style={{ marginLeft: 10 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Community Impact Section */}
        <View style={styles.communitySection}>
          <Text style={styles.sectionHeading}>ସମୁଦାୟ ପ୍ରଭାବ (Community Impact)</Text>
          <View style={styles.communityCard}>
            <View style={styles.impactHeader}>
              <View>
                <Text style={styles.impactTitle}>ସାରା ଓଡ଼ିଶାରେ ସଫଳତା</Text>
                <Text style={styles.impactSubtitle}>ଆମେ ସମସ୍ତେ ମିଶି ପରିବେଶ ବଞ୍ଚାଉଛୁ</Text>
              </View>
              <Ionicons name="globe-outline" size={32} color="#008000" />
            </View>

            <View style={styles.impactStats}>
              <View style={styles.impactStatItem}>
                <Text style={styles.impactStatValue}>1,250</Text>
                <Text style={styles.impactStatLabel}>ଟନ୍ CO2 ବଞ୍ଚାଗଲା</Text>
              </View>
              <View style={styles.impactDivider} />
              <View style={styles.impactStatItem}>
                <Text style={styles.impactStatValue}>15,200</Text>
                <Text style={styles.impactStatLabel}>ସକ୍ରିୟ ପରିବାର</Text>
              </View>
            </View>

            <View style={styles.goalContainer}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalText}>ମାସିକ ଲକ୍ଷ୍ୟ: ୮୦%</Text>
                <Text style={styles.goalPercent}>2,000 ଟନ୍</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#4CAF50', '#81C784']}
                  style={[styles.progressBarFill, { width: '80%' }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  communitySection: {
    padding: 20,
    marginTop: 10,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  communityCard: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  impactSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 20,
  },
  impactStatItem: {
    alignItems: 'center',
  },
  impactStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  impactStatLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    fontWeight: '600',
  },
  impactDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#DDD',
  },
  goalContainer: {
    marginTop: 5,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  goalPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  bottomSpace: {
    height: 30,
  },
  heroSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroBranding: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  heroGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  heroIcons: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weatherPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  carouselContainer: {
    position: 'relative',
    height: 280,
    marginTop: -40, // Overlap effect
  },
  carouselItem: {
    width: width - 40,
    height: 240,
    paddingHorizontal: 8,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 20,
  },
  carouselContent: {
    alignItems: 'flex-start',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: {
    color: '#7FFF00',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
    letterSpacing: 1,
  },
  carouselTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    lineHeight: 30,
  },
  carouselSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  externalPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
    borderRadius: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FF8C00',
    width: 20,
  },
  tickerContainer: {
    backgroundColor: '#FF4500',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  tickerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  stoveSpotlight: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 15,
    borderRadius: 25,
    marginHorizontal: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  stoveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  productTagline: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    width: '31%',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionIconRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  registerBtn: {
    width: '100%',
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
