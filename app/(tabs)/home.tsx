import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing as ReanimatedEasing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const CATEGORIES_DATA = [
  { id: '1345', title: 'କୃଷି (Agri)' },
  { id: '1062', title: 'ଉଦ୍ୟାନ (Horti)' },
  { id: '1063', title: 'ପଶୁପାଳନ (Fish)' },
  { id: '1061', title: 'ସ୍ୱାସ୍ଥ୍ୟ (Health)' },
  { id: '1064', title: 'ସଫଳତା (Success)' },
  { id: '48591', title: 'ଯୋଜନା (Scheme)' },
];

const CAROUSEL_CACHE_KEY = 'utkal_udaya_carousel_cache';

export default function HomeScreen() {
  const { t } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [weather, setWeather] = useState({ temp: '--', city: t.common.loading, icon: '', code: '01d', lat: 21.4937, lon: 83.9812 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSahayikaVisible, setIsSahayikaVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [carouselNews, setCarouselNews] = useState<any[]>([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const router = useRouter();

  // Pulse animation using modern Reanimated
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.5, {
        duration: 800,
        easing: ReanimatedEasing.out(ReanimatedEasing.ease),
      }),
      -1, // infinite
      true // reverse
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7FFF00',
    shadowColor: '#7FFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    marginLeft: 8,
  }));

  const indicatorPulseStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FF4500',
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.5], [0.6, 0]),
  }));

  const getWeatherGradients = () => {
    const code = weather.code || '01d';
    // Mapping: https://openweathermap.org/img/wn/01d@2x.png
    if (code.includes('01') || code.includes('02')) {
      // Sunny / Few Clouds
      return code.endsWith('n') ? ['#1A237E', '#0D47A1'] : ['#FF8C00', '#FF4500'];
    }
    if (code.includes('03') || code.includes('04')) {
      // Cloudy
      return ['#455A64', '#263238'];
    }
    if (code.includes('09') || code.includes('10') || code.includes('11')) {
      // Rain / Storm
      return ['#01579B', '#0277BD'];
    }
    if (code.includes('13') || code.includes('50')) {
      // Snow / Mist
      return ['#78909C', '#546E7A'];
    }
    return ['#FF8C00', '#FF4500']; // Default Orange
  };

  const fetchCarouselNews = useCallback(async () => {
    try {
      const newsPromises = CATEGORIES_DATA.map(async (cat) => {
        try {
          const response = await fetch(`https://meensou.com/myclimate/app/beneficiary/learn/getcategory_json.php?cat=${cat.id}`);
          const data = await response.json();
          const list = data.news || data['new   ws'] || data.new_ws || [];
          if (list.length > 0) {
            return { ...list[0], categoryName: cat.title };
          }
          return null;
        } catch {
          return null;
        }
      });

      const results = await Promise.all(newsPromises);
      const filtered = results.filter(n => n !== null).slice(0, 6);

      if (filtered.length > 0) {
        setCarouselNews(filtered);
        await AsyncStorage.setItem(CAROUSEL_CACHE_KEY, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error fetching carousel news:', error);
    } finally {
      setCarouselLoading(false);
    }
  }, []);

  const loadCachedCarousel = useCallback(async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CAROUSEL_CACHE_KEY);
      if (cachedData) {
        setCarouselNews(JSON.parse(cachedData));
        setCarouselLoading(false);
      }
    } catch (error) {
      console.error('Error loading cached carousel:', error);
    }
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = useCallback(async () => {
    try {
      // First check existing permissions
      let { status } = await Location.getForegroundPermissionsAsync();

      // If not granted, request them
      if (status !== 'granted') {
        // console.log('Location permission not granted. Requesting...');
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      if (status !== 'granted') {
        // console.log('Location permission denied after request.');
        setWeather(prev => ({ ...prev, city: 'Permission Denied' }));
        Alert.alert(
          "Permission Required",
          "This app needs location access to show accurate local weather. Please enable it in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }

      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        // console.log('Location services disabled. Attempting to prompt user...');
        if (Platform.OS === 'android') {
          try {
            await Location.enableNetworkProviderAsync();
            const reCheckEnabled = await Location.hasServicesEnabledAsync();
            if (!reCheckEnabled) {
              setWeather(prev => ({ ...prev, city: 'Location Disabled' }));
              return;
            }
          } catch {
            setWeather(prev => ({ ...prev, city: 'Location Disabled' }));
            return;
          }
        } else {
          setWeather(prev => ({ ...prev, city: 'Location Disabled' }));
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services to see the weather for your area.",
            [{ text: "OK" }]
          );
          return;
        }
      }

      // Fetch location and weather
      let location = await Location.getLastKnownPositionAsync();

      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      if (location) {
        const { latitude, longitude } = location.coords;
        // console.log(`Weather trigger - Fresh Location:`, { latitude, longitude });


        const apiKey = "b035fffc7179d3075edb423469937601";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        // console.log('Weather API Response:', data);

        if (data.weather && data.main) {
          setWeather({
            temp: `${Math.round(data.main.temp)}°C`,
            city: data.name,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            code: data.weather[0].icon,
            lat: latitude,
            lon: longitude
          });
        }
      }
    } catch (error) {
      console.warn('Weather fetch error:', error);
      setWeather(prev => ({ ...prev, temp: '--°C', city: 'Unavailable', icon: '', code: '01d' }));
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchWeather(), fetchCarouselNews()]);
    setRefreshing(false);
  }, [fetchWeather, fetchCarouselNews]);

  useEffect(() => {
    loadCachedCarousel();
    fetchWeather();
    fetchCarouselNews();
  }, [fetchWeather, fetchCarouselNews, loadCachedCarousel]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % (carouselNews.length || 1);
      if (flatListRef.current && carouselNews.length > 0) {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, carouselNews.length]);

  const CAROUSEL_CARD_STYLE = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  };

  const renderCarouselItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ width: width - 40, height: 260, paddingHorizontal: 8 }}
      onPress={() => {
        router.push({
          pathname: '/learn/story/[storyId]',
          params: {
            storyId: item.id,
            title: item.title,
            image: item.coverImage,
            url: item.url
          }
        });
      }}
    >
      <View
        className="flex-1 rounded-[32px] bg-black overflow-hidden"
        style={CAROUSEL_CARD_STYLE}
      >
        <View className="flex-1 rounded-[32px] overflow-hidden">
          <Image
            source={{ uri: item.coverImage }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.92)']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', padding: 20 }}
          >
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginBottom: 12,
                  alignSelf: 'flex-start',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.15)',
                }}
              >
                <Ionicons name="leaf" size={14} color="#7FFF00" />
                <Text
                  className="text-[#7FFF00] font-black uppercase tracking-widest"
                  style={{ fontSize: 10, marginLeft: 6 }}
                >
                  {item.categoryName}
                </Text>
              </View>
              <Text
                className="text-white font-black"
                style={{ fontSize: 22, lineHeight: 28, marginBottom: 4 }}
                numberOfLines={2}
                maxFontSizeMultiplier={1.2}
              >
                {item.title}
              </Text>
              <Text
                className="text-white/70 font-medium"
                style={{ fontSize: 12 }}
                maxFontSizeMultiplier={1.2}
              >
                Utkal Udaya Initiative
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Dynamic Weather Header - Compact */}
        <LinearGradient
          colors={getWeatherGradients() as [string, string, ...string[]]}
          style={{
            paddingTop: 14,
            paddingHorizontal: 18,
            paddingBottom: 42,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          {/* Title & Greeting */}
          <View style={{ marginBottom: 12 }}>
            <Text
              className="text-white font-bold tracking-tight"
              style={{ fontSize: 24, letterSpacing: -0.3 }}
              maxFontSizeMultiplier={1.2}
            >
              {t.home.title}
            </Text>
            <Text
              className="text-white/90 font-medium"
              style={{ fontSize: 13, marginTop: 2 }}
              maxFontSizeMultiplier={1.2}
            >
              {t.common.namaskar}
            </Text>
          </View>

          {/* Weather Card - Compact */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/weather-detail',
              params: { lat: weather.lat, lon: weather.lon }
            })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(0,0,0,0.2)',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              minHeight: 38,
            }}
          >
            <Ionicons name="location-sharp" size={14} color="#FFF" />
            <Text
              className="text-white font-semibold ml-2"
              style={{ fontSize: 12 }}
              maxFontSizeMultiplier={1.2}
            >
              {weather.city} • {weather.temp}
            </Text>
            <Animated.View style={pulseStyle} />
            {weather.icon && (
              <Image
                source={{ uri: weather.icon }}
                style={{ width: 22, height: 22, marginLeft: 5 }}
                contentFit="contain"
              />
            )}
            <Ionicons name="chevron-forward" size={12} color="#FFF" style={{ marginLeft: 5, opacity: 0.9 }} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Carousel - Overlaps header for hero effect */}
        <View style={{ marginTop: -32, height: 300 }}>
          {carouselLoading ? (
            <View className="flex-1 justify-center items-center bg-white rounded-[32px]">
              <ActivityIndicator size="large" color="#FF4500" />
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={carouselNews}
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
              {/* Pagination - Improved */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                {carouselNews.map((_, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <View key={i} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 3 }}>
                      {isActive && (
                        <Animated.View style={indicatorPulseStyle} />
                      )}
                      <View
                        style={{
                          width: isActive ? 20 : 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: isActive ? '#FF4500' : 'rgba(0,0,0,0.15)',
                          shadowColor: isActive ? '#FF4500' : 'transparent',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isActive ? 0.4 : 0,
                          shadowRadius: 4,
                          elevation: isActive ? 4 : 0,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Modern Ticker / Latest Updates */}
        {/* Modern Ticker / Latest Updates */}
        {/* Modern Ticker / Latest Updates */}
        {/* <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/notifications')}
          className="mx-4 mt-2 bg-white rounded-full shadow-lg shadow-orange-500/20 elevation-4 flex-row items-center py-2.5 px-3 border border-orange-50"
        >
          <LinearGradient
            colors={['#FF4500', '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-3 py-1.5 rounded-full flex-row items-center shadow-md shadow-orange-500/40"
          >
            <Ionicons name="flash" size={12} color="#FFF" />
            <Text className="text-white text-[10px] font-black ml-1 uppercase tracking-tight">Latest</Text>
          </LinearGradient>

          <View className="w-[1px] h-5 bg-gray-200 mx-3" />

          <View className="flex-1">
            <Text className="text-gray-800 text-[13px] font-bold tracking-tight" numberOfLines={1}>
              {carouselNews.length > 0 ? carouselNews[0].title.replace('\n', ' ') : t.common.loading}
            </Text>
          </View>

          < View className="bg-orange-50 w-7 h-7 rounded-full items-center justify-center ml-2">
            <Ionicons name="chevron-forward" size={16} color="#FF4500" />
          </View>
        </TouchableOpacity> */}

        {/* Bahni Spotlight - iOS/Android consistent */}
        <View style={{ marginHorizontal: 16, marginTop: 16 }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.cardBorder,
            }}
          >
            <View style={{ padding: 20 }}>
              <View className="flex-row justify-between items-center">
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>“{t.common.bahni}” {t.cookstove.title}</Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>{t.cookstove.subtitle}</Text>

              {/* Stats Grid - flex for iOS consistency */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 18, alignItems: 'center', backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#E8F5E9' }}>
                  <Ionicons name="leaf-outline" size={24} color="#2E7D32" />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 8 }} maxFontSizeMultiplier={1.2}>12.5 {t.common.kg}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', marginTop: 2 }} maxFontSizeMultiplier={1.2}>{t.cookstove.co2Saved}</Text>
                </View>
                <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 18, alignItems: 'center', backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF3E0' }}>
                  <Ionicons name="flame-outline" size={24} color="#E65100" />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 8 }} maxFontSizeMultiplier={1.2}>32%</Text>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', marginTop: 2 }} maxFontSizeMultiplier={1.2}>{t.common.efficiency}</Text>
                </View>
                <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 18, alignItems: 'center', backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#E1F5FE' }}>
                  <Ionicons name="timer-outline" size={24} color="#0277BD" />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 8 }} maxFontSizeMultiplier={1.2}>48 {t.cookstove.hours}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', marginTop: 2 }} maxFontSizeMultiplier={1.2}>{t.cookstove.usageTime}</Text>
                </View>
              </View>

              {/* Action Grid - explicit styles for iOS */}
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 }} maxFontSizeMultiplier={1.2}>{t.common.quickActions}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
                {[
                  { title: t.common.odishaSuccess, icon: 'alert-circle-outline' as const, color: '#FF5252' },
                  { title: t.cookstove.requestCallback, icon: 'construct-outline' as const, color: '#FFA000' },
                  { title: t.cookstove.maintenance, icon: 'book-outline' as const, color: '#448AFF' },
                  { title: t.home.impactDesc, icon: 'shield-checkmark-outline' as const, color: '#4CAF50' },
                ].map((action, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    style={{
                      width: '48%',
                      padding: 14,
                      borderRadius: 18,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isDark ? '#0F172A' : '#F8F9FA',
                      borderWidth: 1,
                      borderColor: isDark ? '#334155' : '#F0F0F0',
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: action.color, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Ionicons name={action.icon} size={20} color={action.color} />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, flex: 1 }} numberOfLines={2} maxFontSizeMultiplier={1.2}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/cookstove')}
                style={{ width: '100%', height: 52, borderRadius: 20, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={['#008000', '#006400']}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }} maxFontSizeMultiplier={1.2}>{t.common.getHelp}</Text>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <View className="h-[100px]" />
      </ScrollView>

      {/* Floating Bahni Sahayika Button */}
      {/* <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsSahayikaVisible(true)}
        className="absolute bottom-32 right-6 w-16 h-16 rounded-full shadow-2xl elevation-10 overflow-hidden"
      >
        <LinearGradient
          colors={['#FF4500', '#FF8C00']}
          className="flex-1 justify-center items-center"
        >
          <Ionicons name="sparkles" size={30} color="#FFF" />
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </LinearGradient>
      </TouchableOpacity>

      <BahniSahayikaModal
        isVisible={isSahayikaVisible}
        onClose={() => setIsSahayikaVisible(false)}
      /> */}
    </SafeAreaView>
  );
}
