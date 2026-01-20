import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';

const { width } = Dimensions.get('window');

const LEARN_CAROUSEL = [
    {
        id: '1',
        title: 'ସାରାଦେଶର କୃଷିକ୍ଷେତ୍ରର ସ୍ଥିତିର ସମୀକ୍ଷା',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: '2',
        title: 'ଉନ୍ନତ କୃଷି ପ୍ରଣାଳୀ ଓ ସଫଳତା',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
    }
];

const NEWS_DATA = [
    {
        title: 'ଓଡ଼ିଶାରେ କୃଷି କ୍ଷେତ୍ରରେ ନୂତନ ବିପ୍ଳବ',
        desc: 'New revolution in Odisha agriculture',
        icon: 'newspaper-outline',
        color: '#2E7D32',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400',
        readTime: '୨ ମିନିଟ୍',
        category: 'କୃଷି (Agri)'
    },
    {
        title: 'ସରକାରଙ୍କ ନୂତନ ବିହନ ଯୋଜନା',
        desc: 'New Govt seed scheme',
        icon: 'megaphone-outline',
        color: '#FF8C00',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
        readTime: '୫ ମିନିଟ୍',
        category: 'ଯୋଜନା (Scheme)'
    },
    {
        title: 'ପାଣିପାଗ ସୂଚନା: ବର୍ଷା ଆଶଙ୍କା',
        desc: 'Weather Alert: Rain expected',
        icon: 'cloud-outline',
        color: '#0277BD',
        image: 'https://images.unsplash.com/photo-1514632595861-4d9e80ba6528?auto=format&fit=crop&q=80&w=400',
        readTime: '୧ ମିନିଟ୍',
        category: 'ପାଣିପାଗ (Weather)'
    },
    {
        title: 'ଉନ୍ନତ ଚୁଲି ବ୍ୟବହାରର ସଫଳ କାହାଣୀ',
        desc: 'Success story of clean stove',
        icon: 'star-outline',
        color: '#D81B60',
        image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400',
        readTime: '୩ ମିନିଟ୍',
        category: 'ସଫଳତା (Success)'
    },
    {
        title: 'କୃଷି ଯନ୍ତ୍ରପାତି ଉପରେ ସବସିଡି',
        desc: 'Subsidy on agri tools',
        icon: 'construct-outline',
        color: '#689F38',
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=400',
        readTime: '୪ ମିନିଟ୍',
        category: 'ସୂଚନା (Info)'
    }
];

export default function LearnScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % LEARN_CAROUSEL.length;
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const renderCarouselItem = ({ item }: any) => (
        <View className="px-2" style={{ width: width - 40, height: 200 }}>
            <View className="flex-1 rounded-3xl overflow-hidden bg-white elevation-10 shadow-black shadow-offset-[0px,5px] shadow-opacity-20 shadow-radius-10">
                <Image source={item.image} className="w-full h-full" contentFit="cover" />
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
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <LinearGradient colors={['#FF8C00', '#FF4500']} className="p-6 pb-[60px] rounded-b-[30px]">
                    <Text className="text-[32px] font-bold text-white tracking-[0.5px]">ସମ୍ବାଦ କେନ୍ଦ୍ର</Text>
                    <Text className="text-base text-white/90 mt-1.5">ନିତିଦିନିଆ କୃଷି ଓ ଯୋଜନା ଖବର</Text>
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
                                className={`h-1.5 rounded-full mx-[3px] ${activeIndex === i ? 'w-4 bg-[#FF8C00]' : 'w-1.5 bg-[#DDD]'}`}
                            />
                        ))}
                    </View>
                </View>

                {/* News List */}
                <View className="p-5 mt-2.5">
                    <TouchableOpacity className="mb-[25px] rounded-[20px] overflow-hidden elevation-3" activeOpacity={0.9}>
                        <LinearGradient colors={['#FFEBEE', '#FFCDD2']} className="flex-row items-center p-4">
                            <View className="w-11 h-11 rounded-full bg-[#FF5252] justify-center items-center mr-[15px]">
                                <Ionicons name="flash" size={24} color="#FFF" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-[#C62828] mb-0.5">ବ୍ରେକିଂ ନ୍ୟୁଜ୍ (Breaking News)</Text>
                                <Text className="text-[12px] text-[#555] leading-[18px]">ସମ୍ବଲପୁରରେ କୃଷକ ମେଳା ଆଜିଠାରୁ ଆରମ୍ଭ ହେବାକୁ ଯାଉଛି ।</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#C62828" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text className="text-[22px] font-bold text-[#333] mb-5">ଆଜିର ମୁଖ୍ୟ ଖବର</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {NEWS_DATA.map((news, index) => (
                            <TouchableOpacity key={index} className="w-[48%] h-[220px] bg-white rounded-[24px] mb-4 elevation-10 shadow-black shadow-offset-[0px,6px] shadow-opacity-15 shadow-radius-10 overflow-hidden relative" activeOpacity={0.9}>
                                <Image source={news.image} className="absolute inset-0 w-full h-full" contentFit="cover" />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    className="absolute inset-0 p-[15px] justify-between"
                                >
                                    <View className="flex-row justify-between items-center">
                                        <View style={{ backgroundColor: news.color }} className="w-7 h-7 rounded-[8px] justify-center items-center">
                                            <Ionicons name={news.icon as any} size={14} color="#FFF" />
                                        </View>
                                        <View className="bg-white/20 px-2 py-1 rounded-[10px] border border-white/30">
                                            <Text className="text-white text-[8px] font-bold uppercase tracking-[0.5px]">{news.category}</Text>
                                        </View>
                                    </View>

                                    <View className="mb-[5px]">
                                        <Text className="text-[18px] font-bold text-white leading-[22px] mb-2 shadow-black shadow-offset-[0px,1px] shadow-radius-3">{news.title}</Text>
                                        <View className="flex-row items-center bg-white/15 self-start px-2 py-1 rounded-[12px]">
                                            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
                                            <Text className="text-white text-[10px] font-semibold ml-1">{news.readTime}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="h-[100px]" />
            </ScrollView>
        </SafeAreaView>
    );
}
