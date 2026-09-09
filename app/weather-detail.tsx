import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import HeaderProfileAvatar from '../components/HeaderProfileAvatar';

const API_KEY = "b035fffc7179d3075edb423469937601";

export default function WeatherDetailScreen() {
    const { lat, lon } = useLocalSearchParams();
    const router = useRouter();
    const { isDark, colors } = useAppTheme();
    const [weatherData, setWeatherData] = useState<any>(null);

    const [forecastData, setForecastData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllWeatherData = async () => {
            try {
                // Current Weather
                const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                const weather = await weatherRes.json();

                // Forecast (5 days / 3 hour steps)
                const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                const forecast = await forecastRes.json();

                console.log('--- WEATHER DETAIL LOGS ---');
                console.log('Current Weather:', JSON.stringify(weather, null, 2));
                console.log('Forecast Data:', JSON.stringify(forecast, null, 2));
                console.log('---------------------------');

                setWeatherData(weather);
                setForecastData(forecast);
            } catch (error) {
                console.error('Weather fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (lat && lon) {
            fetchAllWeatherData();
        }
    }, [lat, lon]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#E0F7FA]">
                <ActivityIndicator size="large" color="#00BCD4" />
            </View>
        );
    }

    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    // Filter forecast for tomorrow and the next 2 days (3 days total starting from tomorrow)
    const dailyForecast = (() => {
        if (!forecastData?.list) return [];
        const todayStr = new Date().toISOString().split('T')[0];

        // Use a Map to group by day and pick the midday (12:00:00) slot or the first available for that day
        const daysMap = new Map();
        forecastData.list.forEach((item: any) => {
            const date = item.dt_txt.split(' ')[0];
            if (date !== todayStr) {
                // We prefer the 12:00:00 slot for daily representation, or take the first one found for that date
                if (!daysMap.has(date) || item.dt_txt.includes('12:00:00')) {
                    daysMap.set(date, item);
                }
            }
        });

        return Array.from(daysMap.values()).slice(0, 3);
    })();
    const hourlyForecast = forecastData?.list.slice(0, 8) || [];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
            <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: isDark ? '#1E293B' : 'rgba(255,255,255,0.7)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: '900', marginLeft: 14, color: colors.text }}>Local Forecast</Text>
                </View>
                <HeaderProfileAvatar size={38} borderColor={isDark ? colors.cardBorder : '#FF5722'} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="p-5">
                {/* Main Card */}
                <View
                    style={{
                        backgroundColor: colors.card,
                        borderRadius: 36,
                        padding: 28,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0.3 : 0.1,
                        shadowRadius: 12,
                        elevation: 6,
                        borderWidth: isDark ? 1 : 0,
                        borderColor: colors.cardBorder,
                        marginBottom: 20,
                    }}
                >
                    <Text style={{ fontSize: 22, fontWeight: '900', color: colors.textSecondary, marginBottom: 4 }}>{weatherData?.name}</Text>
                    <View className="flex-row items-baseline mb-4">
                        <Text style={{ fontSize: 68, fontWeight: '900', color: colors.text }}>{Math.round(weatherData?.main.temp)}</Text>
                        <Text style={{ fontSize: 30, fontWeight: '700', color: colors.textSecondary }}>°C</Text>
                    </View>
                    <Image
                        source={{ uri: `https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@4x.png` }}
                        style={{ width: 120, height: 120 }}
                        contentFit="contain"
                    />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textSecondary, textTransform: 'capitalize' }}>{weatherData?.weather[0].description}</Text>
                </View>

                {/* Details Grid */}
                <View
                    style={{
                        backgroundColor: colors.card,
                        borderRadius: 28,
                        padding: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0.3 : 0.1,
                        shadowRadius: 10,
                        elevation: 5,
                        borderWidth: isDark ? 1 : 0,
                        borderColor: colors.cardBorder,
                        marginBottom: 20,
                    }}
                >
                    <View className="flex-row flex-wrap justify-between">
                        <DetailItem isDark={isDark} colors={colors} icon="thermometer-outline" label="Real feel" value={`${Math.round(weatherData?.main.feels_like)}°C`} />
                        <DetailItem isDark={isDark} colors={colors} icon="water-outline" label="Humidity" value={`${weatherData?.main.humidity}%`} />
                        <DetailItem isDark={isDark} colors={colors} icon="speedometer-outline" label="Wind" value={`${Math.round(weatherData?.wind.speed * 3.6)} km/h`} />
                        <DetailItem isDark={isDark} colors={colors} icon="umbrella-outline" label="Precipitation" value={`${Math.round((forecastData?.list[0]?.pop || 0) * 100)}%`} />
                        <DetailItem isDark={isDark} colors={colors} icon="sunny-outline" label="Sunrise" value={formatTime(weatherData?.sys.sunrise)} />
                        <DetailItem isDark={isDark} colors={colors} icon="moon-outline" label="Sunset" value={formatTime(weatherData?.sys.sunset)} />
                    </View>
                </View>

                {/* 3 Day Forecast */}
                <View
                    style={{
                        backgroundColor: colors.card,
                        borderRadius: 28,
                        padding: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0.3 : 0.1,
                        shadowRadius: 10,
                        elevation: 5,
                        borderWidth: isDark ? 1 : 0,
                        borderColor: colors.cardBorder,
                        marginBottom: 20,
                    }}
                >
                    <Text style={{ fontSize: 19, fontWeight: '900', color: colors.text, marginBottom: 16 }}>3 Day Forecast</Text>
                    {dailyForecast.map((item: any, idx: number) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: idx < dailyForecast.length - 1 ? 1 : 0, borderBottomColor: colors.divider }}>
                            <Text style={{ flex: 1, fontWeight: '700', color: colors.textSecondary }}>{getDayName(item.dt_txt)}</Text>
                            <Image
                                source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                                style={{ width: 40, height: 40 }}
                            />
                            <Text style={{ flex: 1, textAlign: 'right', fontWeight: '900', color: colors.text }}>{Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°</Text>
                        </View>
                    ))}
                </View>

                {/* Hourly Forecast */}
                <View
                    style={{
                        backgroundColor: colors.card,
                        borderRadius: 28,
                        padding: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0.3 : 0.1,
                        shadowRadius: 10,
                        elevation: 5,
                        borderWidth: isDark ? 1 : 0,
                        borderColor: colors.cardBorder,
                        marginBottom: 36,
                    }}
                >
                    <Text style={{ fontSize: 19, fontWeight: '900', color: colors.text, marginBottom: 16 }}>Hourly Forecast</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {hourlyForecast.map((item: any, idx: number) => (
                            <View key={idx} className="items-center mr-6">
                                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 8 }}>
                                    {new Date(item.dt * 1000).getHours() === new Date().getHours() ? 'Now' : formatTime(item.dt).split(' ')[0]}
                                </Text>
                                <View style={{ backgroundColor: isDark ? '#0F172A' : '#F0F7FF', padding: 12, borderRadius: 16, alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <Text style={{ fontSize: 14, fontWeight: '900', color: colors.text, marginTop: 4 }}>{Math.round(item.main.temp)}°</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailItem({ icon, label, value, isDark, colors }: { icon: any, label: string, value: string, isDark: boolean, colors: any }) {
    return (
        <View className="w-[48%] flex-row items-center mb-5">
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? '#0F172A' : '#F0F7FF', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={icon} size={20} color="#00BCD4" />
            </View>
            <View className="ml-3">
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' }}>{label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '900', color: colors.text }}>{value}</Text>
            </View>
        </View>
    );
}
