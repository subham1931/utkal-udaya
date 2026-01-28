import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_KEY = "b035fffc7179d3075edb423469937601";

export default function WeatherDetailScreen() {
    const { lat, lon } = useLocalSearchParams();
    const router = useRouter();
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
        <SafeAreaView className="flex-1 bg-[#E0F7FA]">
            <View className="px-5 pt-2 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/50 justify-center items-center">
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-black ml-4 text-[#333]">Local Forecast</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="p-5">
                {/* Main Card */}
                <View className="bg-white rounded-[40px] p-8 items-center shadow-xl shadow-cyan-900/10 elevation-5 mb-6">
                    <Text className="text-2xl font-black text-[#555] mb-1">{weatherData?.name}</Text>
                    <View className="flex-row items-baseline mb-4">
                        <Text className="text-[72px] font-black text-[#333]">{Math.round(weatherData?.main.temp)}</Text>
                        <Text className="text-[32px] font-bold text-[#555]">°C</Text>
                    </View>
                    <Image
                        source={{ uri: `https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@4x.png` }}
                        style={{ width: 120, height: 120 }}
                        contentFit="contain"
                    />
                    <Text className="text-lg font-bold text-[#666] capitalize">{weatherData?.weather[0].description}</Text>
                </View>

                {/* Details Grid */}
                <View className="bg-white rounded-[32px] p-6 shadow-xl shadow-cyan-900/10 elevation-5 mb-6">
                    <View className="flex-row flex-wrap justify-between">
                        <DetailItem icon="thermometer-outline" label="Real feel" value={`${Math.round(weatherData?.main.feels_like)}°C`} />
                        <DetailItem icon="water-outline" label="Humidity" value={`${weatherData?.main.humidity}%`} />
                        <DetailItem icon="speedometer-outline" label="Wind" value={`${Math.round(weatherData?.wind.speed * 3.6)} km/h`} />
                        <DetailItem icon="umbrella-outline" label="Precipitation" value={`${Math.round((forecastData?.list[0]?.pop || 0) * 100)}%`} />
                        <DetailItem icon="sunny-outline" label="Sunrise" value={formatTime(weatherData?.sys.sunrise)} />
                        <DetailItem icon="moon-outline" label="Sunset" value={formatTime(weatherData?.sys.sunset)} />
                    </View>
                </View>

                {/* 3 Day Forecast */}
                <View className="bg-white rounded-[32px] p-6 shadow-xl shadow-cyan-900/10 elevation-5 mb-6">
                    <Text className="text-xl font-black text-[#333] mb-4">3 Day Forecast</Text>
                    {dailyForecast.map((item: any, idx: number) => (
                        <View key={idx} className="flex-row items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                            <Text className="flex-1 font-bold text-[#555]">{getDayName(item.dt_txt)}</Text>
                            <Image
                                source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                                style={{ width: 40, height: 40 }}
                            />
                            <Text className="flex-1 text-right font-black text-[#333]">{Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°</Text>
                        </View>
                    ))}
                </View>

                {/* Hourly Forecast */}
                <View className="bg-white rounded-[32px] p-6 shadow-xl shadow-cyan-900/10 elevation-5 mb-10">
                    <Text className="text-xl font-black text-[#333] mb-4">Hourly Forecast</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {hourlyForecast.map((item: any, idx: number) => (
                            <View key={idx} className="items-center mr-6">
                                <Text className="text-[12px] font-bold text-[#888] mb-2">
                                    {new Date(item.dt * 1000).getHours() === new Date().getHours() ? 'Now' : formatTime(item.dt).split(' ')[0]}
                                </Text>
                                <View className="bg-[#F0F7FF] p-3 rounded-2xl items-center">
                                    <Image
                                        source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <Text className="text-sm font-black text-[#333] mt-1">{Math.round(item.main.temp)}°</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <View className="w-[48%] flex-row items-center mb-5">
            <View className="w-10 h-10 rounded-xl bg-[#F0F7FF] justify-center items-center">
                <Ionicons name={icon} size={20} color="#00BCD4" />
            </View>
            <View className="ml-3">
                <Text className="text-[11px] font-bold text-[#AAA] uppercase">{label}</Text>
                <Text className="text-[14px] font-black text-[#444]">{value}</Text>
            </View>
        </View>
    );
}
