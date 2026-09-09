import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

const LEARN_CAROUSEL_CACHE_KEY = 'utkal_udaya_learn_carousel_cache_v2';

const CATEGORIES_DATA = [
    {
        id: '1',
        apiId: '1345',
        title: 'କୃଷି',
        titleEn: 'Agriculture',
        subtitle: 'ଚାଷବାସ ଓ ବିହନ',
        subtitleEn: 'Crops & Farming',
        icon: 'leaf-outline',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
        color: '#10B981',
        tag: 'Agri',
    },
    {
        id: '2',
        apiId: '1062',
        title: 'ଉଦ୍ୟାନ',
        titleEn: 'Horticulture',
        subtitle: 'ଫଳ ଓ ପନିପରିବା',
        subtitleEn: 'Fruits & Plants',
        icon: 'flower-outline',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
        color: '#F59E0B',
        tag: 'Horti',
    },
    {
        id: '3',
        apiId: '1063',
        title: 'ପଶୁପାଳନ',
        titleEn: 'Livestock & Dairy',
        subtitle: 'ଦୁଗ୍ଧ ଓ ଗୋପାଳନ',
        subtitleEn: 'Animal Care & Dairy',
        icon: 'paw-outline',
        image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
        color: '#06B6D4',
        tag: 'Dairy',
    },
    {
        id: '4',
        apiId: '1061',
        title: 'ସ୍ୱାସ୍ଥ୍ୟ',
        titleEn: 'Health & Living',
        subtitle: 'ପରିବେଶ ଓ ସ୍ୱାସ୍ଥ୍ୟ',
        subtitleEn: 'Clean Air & Living',
        icon: 'heart-outline',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
        color: '#EC4899',
        tag: 'Health',
    },
    {
        id: '5',
        apiId: '1064',
        title: 'ସଫଳତା',
        titleEn: 'Success Stories',
        subtitle: 'ପ୍ରେରଣାଦାୟୀ କାହାଣୀ',
        subtitleEn: 'Inspiring Farmers',
        icon: 'ribbon-outline',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
        color: '#8B5CF6',
        tag: 'Success',
    },
    {
        id: '6',
        apiId: '48591',
        title: 'ଯୋଜନା',
        titleEn: 'Govt Schemes',
        subtitle: 'ସରକାରୀ ସୁବିଧା',
        subtitleEn: 'Subsidy & Grants',
        icon: 'document-text-outline',
        image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
        color: '#3B82F6',
        tag: 'Schemes',
    },
];

const DEFAULT_FEATURED_NEWS = [
    {
        id: 'feat-1',
        title: 'ଓଡ଼ିଶାରେ ଚଳିତ ବର୍ଷ ଉନ୍ନତ ବିହନ ଓ ଜୈବିକ ଖତ ବ୍ୟବହାର ଉପରେ ଗୁରୁତ୍ୱ',
        titleEn: 'Focus on High-Yield Hybrid Seeds and Organic Fertilizers in Odisha',
        categoryName: 'କୃଷି',
        categoryNameEn: 'Agriculture',
        coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
        readTime: '3 min read',
        badge: 'TOP STORY',
    },
    {
        id: 'feat-2',
        title: 'କାଳିଆ ଓ ପିଏମ କିଷାନ ଯୋଜନାର ନୂତନ କିସ୍ତି ପ୍ରଦାନ ସମ୍ବନ୍ଧରେ ବିଶେଷ ସୂଚନା',
        titleEn: 'Latest Disbursement Notice for KALIA & PM-KISAN Beneficiaries',
        categoryName: 'ଯୋଜନା',
        categoryNameEn: 'Govt Schemes',
        coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
        readTime: '4 min read',
        badge: 'GOVT SCHEME',
    },
    {
        id: 'feat-3',
        title: 'ଉନ୍ନତ ଧୂଆଁମୁକ୍ତ ଚୁଲି ବ୍ୟବହାର ଦ୍ୱାରା ଘରେ ରୋଷେଇ ସହଜ ଓ ସ୍ୱାସ୍ଥ୍ୟ ସୁରକ୍ଷିତ',
        titleEn: 'Clean Cookstoves Ensure Smoke-Free Kitchens & Family Health',
        categoryName: 'ସ୍ୱାସ୍ଥ୍ୟ',
        categoryNameEn: 'Health & Living',
        coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800',
        readTime: '2 min read',
        badge: 'CLEAN AIR',
    },
    {
        id: 'feat-4',
        title: 'ମହିଳା ସ୍ୱୟଂ ସହାୟକ ଗୋଷ୍ଠୀଙ୍କ ସଫଳ ଦୁଗ୍ଧ ଉତ୍ପାଦନ ଓ ଆତ୍ମନିର୍ଭରଶୀଳତା',
        titleEn: 'Women SHGs Achieve Financial Freedom Through Dairy Farming',
        categoryName: 'ସଫଳତା',
        categoryNameEn: 'Success Story',
        coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
        readTime: '5 min read',
        badge: 'INSPIRING',
    },
];

export default function LearnScreen() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const isOdia = language === 'or';

    const [activeIndex, setActiveIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [carouselNews, setCarouselNews] = useState<any[]>(DEFAULT_FEATURED_NEWS);
    const [carouselLoading, setCarouselLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const fetchCarouselNews = useCallback(async () => {
        try {
            const newsPromises = CATEGORIES_DATA.map(async (cat) => {
                try {
                    const response = await fetch(`https://meensou.com/myclimate/app/beneficiary/learn/getcategory_json.php?cat=${cat.apiId}`);
                    const data = await response.json();
                    const list = data?.news || data?.['new   ws'] || data?.new_ws || [];
                    if (Array.isArray(list) && list.length > 0 && list[0]?.title) {
                        return {
                            ...list[0],
                            categoryName: cat.title,
                            categoryNameEn: cat.titleEn,
                            readTime: '3 min read',
                            badge: 'UPDATE',
                        };
                    }
                    return null;
                } catch {
                    return null;
                }
            });

            const results = await Promise.all(newsPromises);
            const filtered = results.filter((n): n is any => n !== null);

            if (filtered.length > 0) {
                setCarouselNews(filtered);
                await AsyncStorage.setItem(LEARN_CAROUSEL_CACHE_KEY, JSON.stringify(filtered));
            } else {
                setCarouselNews(DEFAULT_FEATURED_NEWS);
            }
        } catch (error) {
            console.error('Error fetching learn carousel:', error);
            setCarouselNews(DEFAULT_FEATURED_NEWS);
        } finally {
            setCarouselLoading(false);
        }
    }, []);

    const loadCachedCarousel = useCallback(async () => {
        try {
            const cachedData = await AsyncStorage.getItem(LEARN_CAROUSEL_CACHE_KEY);
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCarouselNews(parsed);
                }
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

    // Auto scroll carousel
    useEffect(() => {
        if (!carouselNews || carouselNews.length <= 1) return;
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % carouselNews.length;
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
                setActiveIndex(nextIndex);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex, carouselNews.length]);

    const cardWidth = (width - 48) / 2;

    const renderCarouselItem = ({ item }: { item: any }) => {
        const displayTitle = (isOdia ? item.title : (item.titleEn || item.title)) || item.title;
        const displayCategory = (isOdia ? item.categoryName : (item.categoryNameEn || item.categoryName)) || 'News';
        const imageSource = item.coverImage || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800';

        return (
            <TouchableOpacity
                activeOpacity={0.92}
                style={{ width: width - 40, marginHorizontal: 2 }}
                onPress={() => {
                    if (item.url || item.id) {
                        router.push({
                            pathname: '/learn/story/[storyId]',
                            params: {
                                storyId: item.id || 'feat-1',
                                title: displayTitle,
                                image: imageSource,
                                url: item.url || ''
                            }
                        });
                    }
                }}
            >
                <View
                    style={{
                        height: 215,
                        borderRadius: 24,
                        overflow: 'hidden',
                        backgroundColor: '#1E293B',
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.22,
                        shadowRadius: 10,
                    }}
                >
                    <Image
                        source={{ uri: imageSource }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        transition={300}
                    />

                    {/* Rich Dark Gradient Scrim */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.92)']}
                        locations={[0, 0.45, 1]}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', padding: 18 }}>
                        {/* Top Badges Row */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#FF4500',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 12,
                                    shadowColor: '#FF4500',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 4,
                                }}
                            >
                                <Ionicons name="sparkles" size={11} color="#FFF" />
                                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800', marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {displayCategory}
                                </Text>
                            </View>

                            {item.badge && (
                                <View
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.22)',
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.35)',
                                    }}
                                >
                                    <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1 }}>
                                        {item.badge}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Bottom Headline & Metadata */}
                        <View>
                            <Text
                                style={{
                                    color: '#FFF',
                                    fontSize: 16,
                                    fontWeight: '800',
                                    lineHeight: 23,
                                    marginBottom: 8,
                                    textShadowColor: 'rgba(0,0,0,0.6)',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 3,
                                }}
                                numberOfLines={2}
                            >
                                {displayTitle}
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
                                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', marginLeft: 4 }}>
                                        {item.readTime || '3 min read'}
                                    </Text>
                                </View>
                                <Text style={{ color: '#FFB266', fontSize: 11, fontWeight: '700' }}>
                                    {isOdia ? 'ସମ୍ପୂର୍ଣ୍ଣ ପଢ଼ନ୍ତୁ →' : 'Read Story →'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF4500']} tintColor="#FF4500" />
                }
            >
                {/* Hero Header */}
                <LinearGradient
                    colors={['#FF6F00', '#FF3D00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 16,
                        paddingBottom: 26,
                        borderBottomLeftRadius: 28,
                        borderBottomRightRadius: 28,
                        elevation: 6,
                        shadowColor: '#FF4500',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80', marginRight: 6 }} />
                            <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                {isOdia ? 'ନୂତନ ସମ୍ବାଦ' : 'DAILY NEWS'}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="newspaper-outline" size={19} color="#FFF" />
                        </View>
                    </View>

                    <Text style={{ fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: 0.3 }}>
                        {t.learn.title}
                    </Text>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.92)', marginTop: 4, fontWeight: '500' }}>
                        {t.learn.subtitle}
                    </Text>
                </LinearGradient>

                {/* Featured Carousel Section */}
                <View style={{ marginTop: 22 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 19, fontWeight: '800', color: '#1E293B' }}>
                                {isOdia ? 'ମୁଖ୍ୟ ଖବର' : 'Featured News'}
                            </Text>
                            <View style={{ backgroundColor: '#FFEDE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 8 }}>
                                <Text style={{ color: '#FF4500', fontSize: 10, fontWeight: '800' }}>
                                    {isOdia ? 'ଆଜି' : 'TOP'}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>
                            {carouselNews.length} {isOdia ? 'ଖବର' : 'stories'}
                        </Text>
                    </View>

                    {carouselLoading ? (
                        <View style={{ height: 215, justifyContent: 'center', alignItems: 'center' }}>
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
                                snapToInterval={width - 36}
                                decelerationRate="fast"
                                showsHorizontalScrollIndicator={false}
                                onScroll={(e) => {
                                    const x = e.nativeEvent.contentOffset.x;
                                    const newIdx = Math.round(x / (width - 36));
                                    if (newIdx !== activeIndex && newIdx >= 0 && newIdx < carouselNews.length) {
                                        setActiveIndex(newIdx);
                                    }
                                }}
                                keyExtractor={(item, index) => item.id || `carousel-${index}`}
                                contentContainerStyle={{ paddingHorizontal: 18 }}
                            />

                            {/* Carousel Indicators */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                                {carouselNews.map((_, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            height: 6,
                                            borderRadius: 3,
                                            marginHorizontal: 3,
                                            width: activeIndex === i ? 22 : 6,
                                            backgroundColor: activeIndex === i ? '#FF4500' : '#E2E8F0',
                                        }}
                                    />
                                ))}
                            </View>
                        </>
                    )}
                </View>

                {/* Explore Topics (Categories) */}
                <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <View>
                            <Text style={{ fontSize: 19, fontWeight: '800', color: '#1E293B' }}>
                                {isOdia ? 'ବିଷୟବସ୍ତୁ' : 'Explore Topics'}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>
                                {isOdia ? 'ବିଭାଗ ଅନୁଯାୟୀ ଖବର ପଢ଼ନ୍ତୁ' : 'Browse stories by category'}
                            </Text>
                        </View>

                        <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                            <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>
                                {CATEGORIES_DATA.length} {isOdia ? 'ବିଭାଗ' : 'Categories'}
                            </Text>
                        </View>
                    </View>

                    {/* 2-Column Responsive Card Grid */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {CATEGORIES_DATA.map((category) => {
                            const catTitle = isOdia ? category.title : category.titleEn;
                            const catSub = isOdia ? category.subtitle : category.subtitleEn;

                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    activeOpacity={0.88}
                                    style={{
                                        width: cardWidth,
                                        height: 150,
                                        marginBottom: 14,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        backgroundColor: '#FFFFFF',
                                        elevation: 5,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.12,
                                        shadowRadius: 6,
                                    }}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/learn/[id]',
                                            params: { id: category.apiId, title: catTitle }
                                        });
                                    }}
                                >
                                    <Image
                                        source={{ uri: category.image }}
                                        style={StyleSheet.absoluteFill}
                                        contentFit="cover"
                                        transition={300}
                                    />

                                    {/* Gradient overlay */}
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.88)']}
                                        locations={[0, 0.4, 1]}
                                        style={StyleSheet.absoluteFill}
                                    />

                                    <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
                                        {/* Top Icon Badge */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 11,
                                                    backgroundColor: 'rgba(255,255,255,0.22)',
                                                    borderWidth: 1,
                                                    borderColor: 'rgba(255,255,255,0.35)',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Ionicons name={category.icon as any} size={17} color="#FFF" />
                                            </View>

                                            <View
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: category.color,
                                                }}
                                            />
                                        </View>

                                        {/* Bottom Titles */}
                                        <View>
                                            <Text
                                                style={{
                                                    color: '#FFF',
                                                    fontSize: 15,
                                                    fontWeight: '800',
                                                    lineHeight: 20,
                                                    textShadowColor: 'rgba(0,0,0,0.6)',
                                                    textShadowOffset: { width: 0, height: 1 },
                                                    textShadowRadius: 2,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {catTitle}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: 11,
                                                    fontWeight: '600',
                                                    marginTop: 2,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {catSub}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Bottom Spacer for floating Tab Bar */}
                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
