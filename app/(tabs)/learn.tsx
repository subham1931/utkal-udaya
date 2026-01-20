import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
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
        <View style={styles.carouselItem}>
            <View style={styles.cardContainer}>
                <Image source={item.image} style={styles.carouselImage} contentFit="cover" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.carouselOverlay}
                >
                    <Text style={styles.carouselTitle}>{item.title}</Text>
                </LinearGradient>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modern Hero Header */}
                <LinearGradient colors={['#FF8C00', '#FF4500']} style={styles.heroHeader}>
                    <Text style={styles.heroTitle}>ସମ୍ବାଦ କେନ୍ଦ୍ର</Text>
                    <Text style={styles.heroSubtitle}>ନିତିଦିନିଆ କୃଷି ଓ ଯୋଜନା ଖବର</Text>
                </LinearGradient>

                {/* Informational Carousel */}
                <View style={styles.carouselWrapper}>
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
                    <View style={styles.pagination}>
                        {LEARN_CAROUSEL.map((_, i) => (
                            <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
                        ))}
                    </View>
                </View>

                {/* News List */}
                <View style={styles.content}>
                    <TouchableOpacity style={styles.tipCard} activeOpacity={0.9}>
                        <LinearGradient colors={['#FFEBEE', '#FFCDD2']} style={styles.tipGradient}>
                            <View style={[styles.tipIconBox, { backgroundColor: '#FF5252' }]}>
                                <Ionicons name="flash" size={24} color="#FFF" />
                            </View>
                            <View style={styles.tipContent}>
                                <Text style={[styles.tipTitle, { color: '#C62828' }]}>ବ୍ରେକିଂ ନ୍ୟୁଜ୍ (Breaking News)</Text>
                                <Text style={styles.tipText}>ସମ୍ବଲପୁରରେ କୃଷକ ମେଳା ଆଜିଠାରୁ ଆରମ୍ଭ ହେବାକୁ ଯାଉଛି ।</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#C62828" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>ଆଜିର ମୁଖ୍ୟ ଖବର</Text>
                    <View style={styles.grid}>
                        {NEWS_DATA.map((news, index) => (
                            <TouchableOpacity key={index} style={styles.courseCard} activeOpacity={0.9}>
                                <Image source={news.image} style={styles.courseBgImage} contentFit="cover" />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={styles.courseOverlay}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={[styles.miniIconBox, { backgroundColor: news.color }]}>
                                            <Ionicons name={news.icon as any} size={14} color="#FFF" />
                                        </View>
                                        <View style={styles.levelBadge}>
                                            <Text style={styles.levelText}>{news.category}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardBody}>
                                        <Text style={styles.courseTitleWhite}>{news.title}</Text>
                                        <View style={styles.lessonPill}>
                                            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
                                            <Text style={styles.lessonText}>{news.readTime}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    heroHeader: {
        padding: 24,
        paddingBottom: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 5,
    },
    carouselWrapper: {
        marginTop: -40,
        height: 240,
    },
    carouselItem: {
        width: width - 40,
        height: 200,
        paddingHorizontal: 8,
    },
    cardContainer: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
    },
    carouselOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 15,
    },
    carouselTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DDD',
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#FF8C00',
        width: 16,
    },
    content: {
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    progressCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#444',
    },
    progressPercent: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF4500',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressInfo: {
        fontSize: 11,
        color: '#888',
        fontWeight: '500',
    },
    tipCard: {
        marginBottom: 25,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 3,
    },
    tipGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    tipIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0277BD',
        marginBottom: 2,
    },
    tipText: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18,
    },
    courseCard: {
        width: '48%',
        height: 220,
        backgroundColor: '#FFF',
        borderRadius: 24,
        marginBottom: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    courseBgImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    courseOverlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 15,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    miniIconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    levelText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardBody: {
        marginBottom: 5,
    },
    courseTitleWhite: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        lineHeight: 22,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    lessonPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    lessonText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
        marginLeft: 4,
    },
    bottomSpace: {
        height: 40,
    },
});
