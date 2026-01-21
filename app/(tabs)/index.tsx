import { Image } from 'expo-image';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';

import { useLanguage } from '../../context/LanguageContext';
import BahniSahayikaModal from '../../components/BahniSahayikaModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState({ temp: '--', city: t.common.loading, icon: '' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSahayikaVisible, setIsSahayikaVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const CAROUSEL_DATA = [
    {
      id: '1',
      title: t.home.carousel[0].title,
      subtitle: t.home.carousel[0].subtitle,
      image: { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000' },
    },
    {
      id: '2',
      title: t.home.carousel[1].title,
      subtitle: t.home.carousel[1].subtitle,
      image: { uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000' },
    },
    {
      id: '3',
      title: t.home.carousel[2].title,
      subtitle: t.home.carousel[2].subtitle,
      image: { uri: 'https://images.unsplash.com/photo-1542601906970-3c10f3c50974?auto=format&fit=crop&q=80&w=1000' },
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setWeather(prev => ({ ...prev, city: 'Access Denied' }));
          return;
        }
        setWeather({
          temp: '25°C',
          city: 'Sambalpur, Odisha',
          icon: 'https://openweathermap.org/img/wn/01d@2x.png'
        });
      } catch {
        setWeather({ temp: '25°C', city: 'Sambalpur (Static)', icon: '' });
      }
    })();

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % CAROUSEL_DATA.length;
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, CAROUSEL_DATA.length]);

  const renderCarouselItem = ({ item }: { item: typeof CAROUSEL_DATA[0] }) => (
    <View className="px-2" style={{ width: width - 40, height: 240 }}>
      {/* Shadow Container */}
      <View className="flex-1 rounded-[30px] bg-black shadow-lg shadow-black/30 elevation-8">
        {/* Content Container (Clipped) */}
        <View className="flex-1 rounded-[30px] overflow-hidden">
          <Image
            source={item.image}
            style={{ width: '100%', height: '100%', opacity: 0.85 }}
            contentFit="cover"
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            transition={200}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0 justify-end p-5"
          >
            <View className="items-start">
              <View className="flex-row items-center bg-black/50 px-2.5 py-1 rounded-full mb-2.5 border border-white/20">
                <Ionicons name="leaf" size={12} color="#7FFF00" />
                <Text className="text-[#7FFF00] text-[10px] font-bold ml-1.5 tracking-widest">{t.home.cleanEnergy}</Text>
              </View>
              <Text className="text-2xl text-white font-bold leading-[30px]">{item.title}</Text>
              <Text className="text-[11px] text-white/70 mt-1.5 font-medium tracking-[0.5px]">{item.subtitle}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#FF8C00', '#FF4500']}
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
          <View className="flex-row items-center bg-black/15 self-start px-3 py-1.5 rounded-full">
            <Ionicons name="location-sharp" size={14} color="#FFF" />
            <Text className="text-white text-[12px] font-semibold ml-1.5">{weather.city} • {weather.temp}</Text>
          </View>
        </LinearGradient>

        {/* Carousel */}
        <View className="relative h-[280px] -mt-10">
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
          <View className="flex-row justify-center items-center mt-3 mb-2">
            {CAROUSEL_DATA.map((_, i) => (
              <View
                key={i}
                className={`h-2 rounded-full mx-1 ${activeIndex === i ? 'w-6 bg-[#FF4500]' : 'w-2 bg-gray-400'}`}
              />
            ))}
          </View>
        </View>

        {/* Ticker */}
        <View className="bg-[#FF4500] py-2 px-[15px]">
          <Text className="text-white text-sm font-bold text-center">
            {t.home.title} {t.home.carousel[0].title.replace('\n', ' ')} ସମ୍ବଲପୁର, ଓଡ଼ିଶା । {t.home.subtitle} ।
          </Text>
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

        {/* Community Impact */}
        <View className="p-5 mt-2.5">
          <Text className="text-[18px] font-bold text-[#333] mb-[15px]">{t.common.communityImpact} (Community Impact)</Text>
          <View className="bg-white rounded-[25px] shadow-lg shadow-black/10 elevation-5">
            <View className="p-5 rounded-[25px] overflow-hidden">
              <View className="flex-row justify-between items-center mb-5">
                <View>
                  <Text className="text-base font-bold text-[#333]">{t.common.odishaSuccess}</Text>
                  <Text className="text-[12px] text-[#777] mt-0.5">{t.home.impactDesc}</Text>
                </View>
                <Ionicons name="globe-outline" size={32} color="#008000" />
              </View>

              <View className="flex-row justify-around items-center bg-[#F8F9FA] rounded-[15px] py-[15px] mb-5">
                <View className="items-center">
                  <Text className="text-xl font-bold text-[#1A1A1A]">1,250</Text>
                  <Text className="text-[10px] text-[#666] mt-[5px] font-semibold">{t.common.tonnes} {t.cookstove.co2Saved}</Text>
                </View>
                <View className="w-[1px] h-[30px] bg-[#DDD]" />
                <View className="items-center">
                  <Text className="text-xl font-bold text-[#1A1A1A]">15,200</Text>
                  <Text className="text-[10px] text-[#666] mt-[5px] font-semibold">{t.common.activeFamilies}</Text>
                </View>
              </View>

              <View className="mt-1">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[12px] font-semibold text-[#444]">{t.home.monthlyGoal}</Text>
                  <Text className="text-[12px] font-bold text-[#2E7D32]">2,000 {t.common.tonnes}</Text>
                </View>
                <View className="h-2.5 bg-[#E8F5E9] rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#4CAF50', '#81C784']}
                    className="h-full rounded-full w-[80%]"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
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
