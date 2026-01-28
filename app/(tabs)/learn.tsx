import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate a reload delay
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const LEARN_CAROUSEL = [
        {
            id: '1',
            title: 'ସାରାଦେଶର କୃଷିକ୍ଷେତ୍ରର ସ୍ଥିତିର ସମୀକ୍ଷା',
            image: { uri: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800' },
        },
        {
            id: '2',
            title: 'ଉନ୍ନତ କୃଷି ପ୍ରଣାଳୀ ଓ ସଫଳତା',
            image: { uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800' },
        }
    ];

    const router = useRouter();

    const CATEGORIES_DATA = [
        { id: '1', apiId: '1345', title: 'କୃଷି ବିଶ୍ୱକୋଷ', icon: 'book-outline', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400', color: '#4CAF50' },
        { id: '2', apiId: '1062', title: 'ଉଦ୍ୟାନ କୃଷି', icon: 'leaf-outline', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400', color: '#FF9800' },
        { id: '3', apiId: '1063', title: 'ମତ୍ସ୍ୟ ଏବଂ ପଶୁପାଳନ', icon: 'paw-outline', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400', color: '#03A9F4' },
        { id: '4', apiId: '1061', title: 'ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ଜୀବନଶୈଳୀ', icon: 'heart-outline', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400', color: '#E91E63' },
        { id: '5', apiId: '1064', title: 'ସଫଳ କାହାଣୀ', icon: 'ribbon-outline', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400', color: '#9C27B0' },
        { id: '6', apiId: '48591', title: 'ସରକାରୀ ଯୋଜନା', icon: 'document-text-outline', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400', color: '#FF5722' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % LEARN_CAROUSEL.length;
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex, LEARN_CAROUSEL.length]);

    const renderCarouselItem = ({ item }: any) => (
        <View className="px-2" style={{ width: width - 40, height: 200 }}>
            <View className="flex-1 rounded-3xl overflow-hidden bg-white elevation-10 shadow-black shadow-offset-[0px,5px] shadow-opacity-20 shadow-radius-10">
                <Image
                    source={item.image}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                    transition={200}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    className="absolute inset-0 justify-end p-[15px]"
                >
                    <Text className="text-white text-lg font-bold leading-6">{item.title}</Text>
                </LinearGradient>
            </View>
        </View>
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
                    <FlatList
                        ref={flatListRef}
                        data={LEARN_CAROUSEL}
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
                        {LEARN_CAROUSEL.map((_, i) => (
                            <View
                                key={i}
                                className={`h-1.5 rounded-full mx-[3px] ${activeIndex === i ? 'w-4 bg-[#FF4500]' : 'w-1.5 bg-[#DDD]'}`}
                            />
                        ))}
                    </View>
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
