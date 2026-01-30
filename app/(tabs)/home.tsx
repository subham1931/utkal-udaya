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

import BahniSahayikaModal from '../../components/BahniSahayikaModal';
import { useLanguage } from '../../context/LanguageContext';

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
        console.log('Location permission not granted. Requesting...');
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      if (status !== 'granted') {
        console.log('Location permission denied after request.');
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
        console.log('Location services disabled. Attempting to prompt user...');
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
      let isCached = true;

      if (!location) {
        isCached = false;
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      if (location) {
        const { latitude, longitude } = location.coords;
        console.log(`Weather trigger - ${isCached ? 'Cached' : 'Fresh'} Location:`, { latitude, longitude });

        const apiKey = "b035fffc7179d3075edb423469937601";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        console.log('Weather API Response:', data);

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

  const renderCarouselItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      className="px-2"
      style={{ width: width - 40, height: 260 }}
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
      <View className="flex-1 rounded-[40px] bg-black shadow-xl shadow-black/40 elevation-10">
        <View className="flex-1 rounded-[40px] overflow-hidden">
          <Image
            source={{ uri: item.coverImage }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
            className="absolute inset-0 justify-end p-7"
          >
            <View>
              <View className="flex-row items-center bg-black/40 px-3 py-1.5 rounded-full mb-3 border border-white/20">
                <Ionicons name="leaf" size={14} color="#7FFF00" />
                <Text className="text-[#7FFF00] text-[10px] font-black ml-2 uppercase tracking-widest">
                  {item.categoryName}
                </Text>
              </View>
              <Text className="text-white text-[26px] font-black leading-8 mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-white/60 text-[12px] font-medium tracking-wide">
                Utkal Udaya Initiative
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Dynamic Weather Header */}
        <LinearGradient
          colors={getWeatherGradients() as [string, string, ...string[]]}
          className="pt-5 px-5 pb-[60px] rounded-b-[40px]"
        >
          <View className="flex-row justify-between items-center mb-5">
            <View>
              <Text className="text-[28px] font-bold text-white tracking-[0.5px]">{t.home.title}</Text>
              <Text className="text-sm text-white/80 font-medium">{t.common.namaskar}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 justify-center items-center ml-2.5">
                <Ionicons name="notifications-outline" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 justify-center items-center ml-2.5">
                <Ionicons name="person-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push({
              pathname: '/weather-detail',
              params: { lat: weather.lat, lon: weather.lon }
            })}
            className="flex-row items-center bg-black/15 self-start px-3 py-1 rounded-full"
          >
            <Ionicons name="location-sharp" size={14} color="#FFF" />
            <Text className="text-white text-[12px] font-semibold ml-1.5">{weather.city} • {weather.temp}</Text>
            <Animated.View style={pulseStyle} />
            {weather.icon && (
              <Image
                source={{ uri: weather.icon }}
                style={{ width: 24, height: 24, marginLeft: 4 }}
                contentFit="contain"
              />
            )}
            <Ionicons name="chevron-forward" size={12} color="#FFF" style={{ marginLeft: 4, opacity: 0.8 }} />
          </TouchableOpacity>
        </LinearGradient>

        <View className="relative h-[300px] -mt-10">
          {carouselLoading ? (
            <View className="flex-1 justify-center items-center">
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
              <View className="flex-row justify-center items-center mt-4">
                {carouselNews.map((_, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <View key={i} className="items-center justify-center mx-1.5">
                      {isActive && (
                        <Animated.View style={indicatorPulseStyle} />
                      )}
                      <View
                        className={`rounded-full transition-all duration-300 ${isActive ? 'w-5 h-2 bg-[#FF4500]' : 'w-2 h-2 bg-gray-300'}`}
                        style={{
                          shadowColor: isActive ? '#FF4500' : 'transparent',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isActive ? 0.4 : 0,
                          shadowRadius: 3,
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
        <View className="mx-4 mt-2 bg-white rounded-2xl border border-gray-100 shadow-sm elevation-2 flex-row items-center py-2 px-3">
          <View className="bg-[#FF4500] px-3 py-1 rounded-full flex-row items-center">
            <Ionicons name="flash" size={12} color="#FFF" />
            <Text className="text-white text-[10px] font-black ml-1 uppercase tracking-tighter">Latest</Text>
          </View>
          <View className="w-[1px] h-4 bg-gray-200 mx-3" />
          <View className="flex-1">
            <Text className="text-gray-800 text-[12px] font-bold" numberOfLines={1}>
              {t.home.carousel[0].title.replace('\n', ' ')} • ସମ୍ବଲପୁର, ଓଡ଼ିଶା
            </Text>
          </View>
          <Ionicons name="chevron-forward-circle" size={16} color="#FF4500" className="ml-2" />
        </View>

        {/* Bahni Spotlight */}
        {/* Bahni Spotlight */}
        <View className="mx-4 mt-4">
          <View className="bg-white rounded-[25px] shadow-lg shadow-black/10 elevation-8">
            <View className="p-5 rounded-[25px] overflow-hidden">
              <View className="flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-[#333]">“{t.common.bahni}” {t.cookstove.title}</Text>
                <View className="flex-row items-center bg-[#E8F5E9] px-2.5 py-1 rounded-full">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] mr-1.5" />
                  <Text className="text-[#2E7D32] text-[12px] font-bold">{t.common.active}</Text>
                </View>
              </View>
              <Text className="text-sm text-[#777] mb-5">{t.cookstove.subtitle}</Text>

              {/* Stats Grid */}
              <View className="flex-row justify-between mb-[25px]">
                <View className="w-[31%] p-[15px] rounded-[20px] items-center bg-[#E8F5E9]">
                  <Ionicons name="leaf-outline" size={24} color="#2E7D32" />
                  <Text className="text-base font-bold text-[#333] mt-2">12.5 {t.common.kg}</Text>
                  <Text className="text-[10px] text-[#666] font-semibold uppercase">{t.cookstove.co2Saved}</Text>
                </View>
                <View className="w-[31%] p-[15px] rounded-[20px] items-center bg-[#FFF3E0]">
                  <Ionicons name="flame-outline" size={24} color="#E65100" />
                  <Text className="text-base font-bold text-[#333] mt-2">32%</Text>
                  <Text className="text-[10px] text-[#666] font-semibold uppercase">{t.common.efficiency}</Text>
                </View>
                <View className="w-[31%] p-[15px] rounded-[20px] items-center bg-[#E1F5FE]">
                  <Ionicons name="timer-outline" size={24} color="#0277BD" />
                  <Text className="text-base font-bold text-[#333] mt-2">48 {t.cookstove.hours}</Text>
                  <Text className="text-[10px] text-[#666] font-semibold uppercase">{t.cookstove.usageTime}</Text>
                </View>
              </View>

              {/* Action Grid */}
              <Text className="text-[18px] font-bold text-[#333] mb-[15px]">{t.common.quickActions}</Text>
              <View className="flex-row flex-wrap justify-between mb-[25px]">
                {[
                  { title: t.common.odishaSuccess, icon: 'alert-circle-outline', color: '#FF5252' },
                  { title: t.cookstove.requestCallback, icon: 'construct-outline', color: '#FFA000' },
                  { title: t.cookstove.maintenance, icon: 'book-outline', color: '#448AFF' },
                  { title: t.home.impactDesc, icon: 'shield-checkmark-outline', color: '#4CAF50' },
                ].map((action, idx) => (
                  <TouchableOpacity key={idx} className="w-[48%] bg-[#F8F9FA] p-[15px] rounded-[20px] flex-row items-center mb-3 border border-[#F0F0F0]">
                    <View className="w-9 h-9 rounded-full border justify-center items-center mr-3" style={{ borderColor: action.color }}>
                      <Ionicons name={action.icon as any} size={22} color={action.color} />
                    </View>
                    <Text className="text-[13px] font-semibold text-[#444] flex-1">{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity activeOpacity={0.8} className="w-full h-[55px] rounded-[15px] overflow-hidden">
                <LinearGradient
                  colors={['#008000', '#006400']}
                  className="flex-1 flex-row items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text className="text-white text-base font-bold">{t.common.getHelp}</Text>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" className="ml-2.5" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <View className="h-[100px]" />
      </ScrollView>

      {/* Floating Bahni Sahayika Button */}
      <TouchableOpacity
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
      />
    </SafeAreaView>
  );
}
