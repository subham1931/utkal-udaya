import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

const LEARN_CAROUSEL_CACHE_KEY = 'utkal_udaya_learn_carousel_cache';

const CATEGORIES_DATA = [
    { id: '1', apiId: '1345', title: 'କୃଷି (Agri)', icon: 'book-outline', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400', color: '#4CAF50' },
    { id: '2', apiId: '1062', title: 'ଉଦ୍ୟାନ (Horti)', icon: 'leaf-outline', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400', color: '#FF9800' },
    { id: '3', apiId: '1063', title: 'ପଶୁପାଳନ (Fish)', icon: 'paw-outline', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400', color: '#03A9F4' },
    { id: '4', apiId: '1061', title: 'ସ୍ୱାସ୍ଥ୍ୟ (Health)', icon: 'heart-outline', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400', color: '#E91E63' },
    { id: '5', apiId: '1064', title: 'ସଫଳତା (Success)', icon: 'ribbon-outline', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400', color: '#9C27B0' },
    { id: '6', apiId: '48591', title: 'ଯୋଜନା (Scheme)', icon: 'document-text-outline', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400', color: '#FF5722' },
];

export default function LearnScreen() {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const [carouselNews, setCarouselNews] = useState<any[]>([]);
    const [carouselLoading, setCarouselLoading] = useState(true);
    const router = useRouter();

    const fetchCarouselNews = useCallback(async () => {
        try {
            const newsPromises = CATEGORIES_DATA.map(async (cat) => {
                try {
                    const response = await fetch(`https://meensou.com/myclimate/app/beneficiary/learn/getcategory_json.php?cat=${cat.apiId}`);
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
                await AsyncStorage.setItem(LEARN_CAROUSEL_CACHE_KEY, JSON.stringify(filtered));
            }
        } catch (error) {
            console.error('Error fetching learn carousel:', error);
        } finally {
            setCarouselLoading(false);
        }
    }, []);

    const loadCachedCarousel = useCallback(async () => {
        try {
            const cachedData = await AsyncStorage.getItem(LEARN_CAROUSEL_CACHE_KEY);
            if (cachedData) {
                setCarouselNews(JSON.parse(cachedData));
                setCarouselLoading(false);
            }
        } catch (error) {
            console.error('Error loading learn cache:', error);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchCarouselNews();
        setRefreshing(false);
    }, [fetchCarouselNews]);

    useEffect(() => {
        loadCachedCarousel();
        fetchCarouselNews();
    }, [fetchCarouselNews, loadCachedCarousel]);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % (carouselNews.length || 1);
            if (flatListRef.current && carouselNews.length > 0) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex, carouselNews.length]);

    const renderCarouselItem = ({ item }: any) => (
        <TouchableOpacity
            activeOpacity={0.9}
            className="px-2"
            style={{ width: width - 40, height: 200 }}
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
            <View className="flex-1 rounded-[30px] overflow-hidden bg-black elevation-10 shadow-black/30">
                <Image
                    source={{ uri: item.coverImage }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={300}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                    className="absolute inset-0 justify-end p-5"
                >
                    <View className="flex-row items-center bg-[#FF4500]/90 px-2.5 py-1 rounded-full self-start mb-2 border border-white/20">
                        <Ionicons name="newspaper-outline" size={10} color="#FFF" />
                        <Text className="text-white text-[9px] font-black ml-1.5 uppercase tracking-widest">{item.categoryName}</Text>
                    </View>
                    <Text className="text-white text-base font-black leading-5" numberOfLines={2}>{item.title}</Text>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Hero Header */}
                <LinearGradient colors={['#FF8C00', '#FF4500']} className="p-6 pb-[60px] rounded-b-[30px]">
                    <Text className="text-[32px] font-bold text-white tracking-[0.5px]">{t.learn.title}</Text>
                    <Text className="text-base text-white/90 mt-1.5">{t.learn.subtitle}</Text>
                </LinearGradient>

                {/* Carousel */}
                <View className="-mt-10 h-[240px]">
                    {carouselLoading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="small" color="#FF4500" />
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
                            <View className="flex-row justify-center mt-2.5">
                                {carouselNews.map((_, i) => (
                                    <View
                                        key={i}
                                        className={`h-1.5 rounded-full mx-[3px] ${activeIndex === i ? 'w-4 bg-[#FF4500]' : 'w-1.5 bg-[#DDD]'}`}
                                    />
                                ))}
                            </View>
                        </>
                    )}
                </View>

                {/* Explore Topics Grid */}
                <View className="px-5 mt-4">
                    <View className="mb-4">
                        <Text className="text-[22px] font-bold text-[#333]">ବିଷୟବସ୍ତୁ (Topics)</Text>
                        <Text className="text-[12px] text-gray-500 font-medium">Explore by category</Text>
                    </View>

                    <View>
                        {CATEGORIES_DATA.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                className="w-full h-[140px] mb-4 rounded-3xl overflow-hidden elevation-8 shadow-black shadow-offset-[0px,4px] shadow-opacity-25 shadow-radius-8 bg-white"
                                activeOpacity={0.9}
                                onPress={() => {
                                    console.log('Category Clicked:', { title: category.title, id: category.apiId });
                                    router.push({
                                        pathname: '/learn/[id]',
                                        params: { id: category.apiId, title: category.title }
                                    });
                                }}
                            >
                                <Image
                                    source={{ uri: category.image }}
                                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                                    contentFit="cover"
                                />
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                                    className="flex-1 p-4 justify-between"
                                >
                                    <View className="w-8 h-8 rounded-xl bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md">
                                        <Ionicons name={category.icon as any} size={18} color="#FFF" />
                                    </View>
                                    <Text className="text-white text-[13px] font-bold leading-5">
                                        {category.title}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="h-[120px]" />
            </ScrollView>
        </SafeAreaView>
    );
}
