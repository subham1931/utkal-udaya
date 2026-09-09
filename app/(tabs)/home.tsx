import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing as ReanimatedEasing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import HeaderProfileAvatar from '../../components/HeaderProfileAvatar';

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
  const { t, language } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const isOdia = language === 'or';

  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);
  const [isImpactModalVisible, setIsImpactModalVisible] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggleTask = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCheckedTasks(prev => ({ ...prev, [index]: !prev[index] }));
  };

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
      /*
      // --- OLD API (Commented out) ---
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
      */

      // --- NEW API: NewsData.io ---
      const response = await fetch('https://newsdata.io/api/1/latest?apikey=pub_133361d89e574a76b448e577121addb2&q=Odisha%20agriculture');
      const data = await response.json();

      if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
        const mappedNews = data.results.map((article: any, index: number) => ({
          id: article.article_id || `news-${index}`,
          title: article.title || 'Odisha Agriculture Update',
          coverImage: article.image_url || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
          url: article.link || '',
          categoryName: (article.category && article.category[0]) ? article.category[0].toUpperCase() : 'ODISHA AGRI',
          short_desc: article.description || '',
          source_name: article.source_name || 'News',
          date: article.pubDate || '',
        }));

        setCarouselNews(mappedNews);
        await AsyncStorage.setItem(CAROUSEL_CACHE_KEY, JSON.stringify(mappedNews));
      }
    } catch (error) {
      console.error('Error fetching carousel news from NewsData.io:', error);
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
          {/* Title, Greeting & Profile Avatar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
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

            <HeaderProfileAvatar size={42} />
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

        {/* Prathamesh Spotlight - iOS/Android consistent */}
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
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>{t.cookstove.title}</Text>
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
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 }} maxFontSizeMultiplier={1.2}>
                {t.common.quickActions}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 }}>
                {[
                  {
                    title: isOdia ? 'ସଫଳତା କାହାଣୀ' : 'Odisha Success',
                    icon: 'ribbon-outline' as const,
                    color: '#FF5252',
                    bgColor: isDark ? 'rgba(255, 82, 82, 0.18)' : '#FFEBEE',
                    onPress: () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push({
                        pathname: '/learn/[id]',
                        params: { id: '1064', title: isOdia ? 'ସଫଳତା (Success)' : 'Success across Odisha' }
                      });
                    }
                  },
                  {
                    title: t.cookstove.requestCallback,
                    icon: 'construct-outline' as const,
                    color: '#FFA000',
                    bgColor: isDark ? 'rgba(255, 160, 0, 0.18)' : '#FFF8E1',
                    onPress: () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push('/(tabs)/cookstove');
                    }
                  },
                  {
                    title: t.cookstove.maintenance,
                    icon: 'book-outline' as const,
                    color: '#448AFF',
                    bgColor: isDark ? 'rgba(68, 138, 255, 0.18)' : '#E3F2FD',
                    onPress: () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setIsMaintenanceModalVisible(true);
                    }
                  },
                  {
                    title: isOdia ? 'ସମୁଦାୟ ପ୍ରଭାବ' : 'Community Impact',
                    icon: 'shield-checkmark-outline' as const,
                    color: '#4CAF50',
                    bgColor: isDark ? 'rgba(76, 175, 80, 0.18)' : '#E8F5E9',
                    onPress: () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setIsImpactModalVisible(true);
                    }
                  },
                ].map((action, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    onPress={action.onPress}
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
                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: action.bgColor, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                      <Ionicons name={action.icon} size={20} color={action.color} />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, flex: 1 }} numberOfLines={2} maxFontSizeMultiplier={1.2}>
                      {action.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/cookstove')}
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

      {/* Maintenance Checklist Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMaintenanceModalVisible}
        onRequestClose={() => setIsMaintenanceModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsMaintenanceModalVisible(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <BlurView intensity={80} tint="dark" style={{ flex: 1 }} />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
              maxHeight: '85%',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: isDark ? 0.4 : 0.15,
              shadowRadius: 16,
              elevation: 20,
            }}
          >
            <LinearGradient
              colors={['#1E88E5', '#1565C0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingTop: 22,
                paddingBottom: 18,
                paddingHorizontal: 24,
                borderTopLeftRadius: 36,
                borderTopRightRadius: 36,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFF' }}>
                    {isOdia ? 'ଚୁଲି ପରିଚାଳନା ଯାଞ୍ଚ' : 'Maintenance Checklist'}
                  </Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                    {isOdia ? 'ପ୍ରଥମେଶ ଚୁଲିର ନିତିଦିନିଆ ଯତ୍ନ' : 'Daily care for your Prathamesh stove'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsMaintenanceModalVisible(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {isOdia ? 'ନିୟମିତ ଯାଞ୍ଚ ତାଲିକା (ଟ୍ୟାପ୍ କରି ଟିକ୍ କରନ୍ତୁ)' : 'Checklist Tasks (Tap to toggle)'}
              </Text>

              {[
                {
                  title: isOdia ? 'ଜଳିବା କକ୍ଷରୁ ପାଉଁଶ ସଫା କରନ୍ତୁ' : 'Clear ash from combustion chamber',
                  desc: isOdia ? 'ଅଧିକ ପାଉଁଶ ଜମା ହେଲେ ପବନ ଚଳାଚଳ ବାଧାପ୍ରାପ୍ତ ହୁଏ ।' : 'Prevents airflow blockage and improves burning heat.',
                },
                {
                  title: isOdia ? 'ବାହ୍ୟ ଶରୀର ଓ ଫାଟ ଯାଞ୍ଚ କରନ୍ତୁ' : 'Inspect stove body and joints for cracks',
                  desc: isOdia ? 'କୌଣସି ଫାଟ ଥିଲେ ତୁରନ୍ତ ସହାୟତା ପାଇଁ ଅନୁରୋଧ କରନ୍ତୁ ।' : 'Report any structural damage or cracks immediately.',
                },
                {
                  title: isOdia ? 'ଶୁଖିଲା କାଠ କାଠି ବ୍ୟବହାର କରନ୍ତୁ' : 'Use dry wood sticks',
                  desc: isOdia ? 'ଓଦା କାଠ ବ୍ୟବହାର କଲେ ଧୂଆଁ ଅଧିକ ହୁଏ ।' : 'Dry fuel ensures smokeless cooking and highest fuel savings.',
                },
                {
                  title: isOdia ? 'ପବନ ଚଳାଚଳ ଦ୍ୱାର ଖୋଲା ରଖନ୍ତୁ' : 'Ensure airflow vents are clear',
                  desc: isOdia ? 'ପବନ ସଠିକ୍ ଭାବେ ପ୍ରବେଶ କଲେ ନିଆଁ ଭଲ ଜଳେ ।' : 'Allows optimal oxygen intake for cleaner combustion.',
                },
                {
                  title: isOdia ? 'ଚୁଲି ଥଣ୍ଡା ହେଲେ ବାହାର ଅଂଶ ପୋଛନ୍ତୁ' : 'Wipe exterior once stove is cold',
                  desc: isOdia ? 'ଚୁଲିର ରଙ୍ଗ ଓ ସ୍ଥାୟିତ୍ୱ ବଜାୟ ରଖେ ।' : 'Keeps the surface clean and prolongs stove lifespan.',
                },
              ].map((task, idx) => {
                const isChecked = !!checkedTasks[idx];
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => toggleTask(idx)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isChecked
                        ? (isDark ? 'rgba(34, 197, 94, 0.15)' : '#F0FDF4')
                        : (isDark ? '#1E293B' : '#F8FAFC'),
                      borderWidth: 1,
                      borderColor: isChecked ? '#22C55E' : (isDark ? '#334155' : '#E2E8F0'),
                      borderRadius: 18,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: isChecked ? '#22C55E' : 'transparent',
                        borderWidth: isChecked ? 0 : 2,
                        borderColor: isChecked ? 'transparent' : (isDark ? '#64748B' : '#94A3B8'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 14,
                      }}
                    >
                      {isChecked && <Ionicons name="checkmark" size={18} color="#FFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '700',
                          color: colors.text,
                          textDecorationLine: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                        {task.desc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsMaintenanceModalVisible(false);
                    router.push('/(tabs)/cookstove');
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: 14,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                    {isOdia ? 'ସହାୟତା ଚାହାଁନ୍ତି କି?' : 'Need Help?'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsMaintenanceModalVisible(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#1E88E5',
                    borderRadius: 14,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>
                    {isOdia ? 'ଠିକ୍ ଅଛି' : 'Done'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Community Impact Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isImpactModalVisible}
        onRequestClose={() => setIsImpactModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsImpactModalVisible(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <BlurView intensity={80} tint="dark" style={{ flex: 1 }} />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
              maxHeight: '85%',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: isDark ? 0.4 : 0.15,
              shadowRadius: 16,
              elevation: 20,
            }}
          >
            <LinearGradient
              colors={['#2E7D32', '#1B5E20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingTop: 22,
                paddingBottom: 18,
                paddingHorizontal: 24,
                borderTopLeftRadius: 36,
                borderTopRightRadius: 36,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFF' }}>
                    {isOdia ? 'ସମୁଦାୟ ପରିବେଶ ପ୍ରଭାବ' : 'Community Impact'}
                  </Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                    {isOdia ? 'ଓଡ଼ିଶାର ସ୍ୱଚ୍ଛ ଭବିଷ୍ୟତ ପାଇଁ ଆମର ଅବଦାନ' : 'Empowering clean cooking across Odisha'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsImpactModalVisible(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 }}>
                {[
                  {
                    val: '12.5 T',
                    lbl: isOdia ? 'CO2 ବଞ୍ଚାଗଲା' : 'CO2 Prevented',
                    icon: 'leaf-outline',
                    color: '#2E7D32',
                    bg: isDark ? 'rgba(46, 125, 50, 0.18)' : '#E8F5E9',
                  },
                  {
                    val: '25,000+',
                    lbl: isOdia ? 'ସକ୍ରିୟ ପରିବାର' : 'Active Families',
                    icon: 'people-outline',
                    color: '#E65100',
                    bg: isDark ? 'rgba(230, 81, 0, 0.18)' : '#FFF3E0',
                  },
                  {
                    val: '32%',
                    lbl: isOdia ? 'କାଠ ସଞ୍ଚୟ' : 'Fuel Wood Saved',
                    icon: 'flame-outline',
                    color: '#0284C7',
                    bg: isDark ? 'rgba(2, 132, 199, 0.18)' : '#E1F5FE',
                  },
                  {
                    val: '120 Pts',
                    lbl: isOdia ? 'କାର୍ବନ ପଏଣ୍ଟ' : 'Carbon Points',
                    icon: 'trophy-outline',
                    color: '#7C3AED',
                    bg: isDark ? 'rgba(124, 58, 237, 0.18)' : '#F3E8FF',
                  },
                ].map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: '48%',
                      padding: 16,
                      borderRadius: 18,
                      backgroundColor: item.bg,
                      marginBottom: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name={item.icon as any} size={26} color={item.color} />
                    <Text style={{ fontSize: 20, fontWeight: '900', color: colors.text, marginTop: 6 }}>
                      {item.val}
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, textAlign: 'center', marginTop: 2 }}>
                      {item.lbl}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={{
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  marginBottom: 20,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="sparkles" size={18} color="#2E7D32" />
                  <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text, marginLeft: 6 }}>
                    {isOdia ? 'ସ୍ୱଚ୍ଛ ଶକ୍ତି ସଂକଳ୍ପ' : 'Our Clean Energy Mission'}
                  </Text>
                </View>
                <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
                  {isOdia
                    ? 'ପ୍ରଥମେଶ ଚୁଲି ବ୍ୟବହାର କରି ଆପଣ ନିଜ ଘରକୁ ଧୂଆଁମୁକ୍ତ ରଖୁଛନ୍ତି ଏବଂ ଓଡ଼ିଶାର ଜଙ୍ଗଲ ଓ ପରିବେଶକୁ ସୁରକ୍ଷିତ କରୁଛନ୍ତି । ଆମେ ସମସ୍ତେ ମିଶି ଏକ ସୁସ୍ଥ ଓ ଉନ୍ନତ ଓଡ଼ିଶା ଗଠନ କରୁଛୁ ।'
                    : 'By using your Prathamesh Cookstove daily, your family eliminates toxic indoor smoke, cuts firewood consumption, and helps preserve Odisha’s lush forest cover.'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsImpactModalVisible(false)}
                style={{
                  backgroundColor: '#2E7D32',
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>
                  {isOdia ? 'ଧନ୍ୟବାଦ (ବନ୍ଦ କରନ୍ତୁ)' : 'Got it (Close)'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
