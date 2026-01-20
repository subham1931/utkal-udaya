import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
    const SettingItem = ({ icon, title, subtitle, onPress, color = '#555' }: any) => (
        <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-[#F5F5F5]"
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <View
                    style={{ backgroundColor: color + '15' }}
                    className="w-10 h-10 rounded-xl justify-center items-center mr-[15px]"
                >
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <View>
                    <Text className="text-[15px] font-bold text-[#333]">{title}</Text>
                    {subtitle && <Text className="text-[11px] text-[#999] mt-0.5">{subtitle}</Text>}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F0F7FF]">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={['#FF8C00', '#FF4500']}
                    className="p-6 pb-10 rounded-b-[30px]"
                >
                    <Text className="text-[28px] font-bold text-white">ସେଟିଙ୍ଗସ୍ (Settings)</Text>
                    <Text className="text-sm text-white/80 mt-1">Legal & Support Center</Text>
                </LinearGradient>

                <View className="p-5">
                    {/* Legal Section */}
                    <View className="mb-[25px]">
                        <Text className="text-sm font-bold text-[#666] mb-2.5 ml-[5px] uppercase tracking-widest">ଆଇନଗତ (Legal)</Text>
                        <View className="bg-white rounded-[20px] overflow-hidden elevation-4 shadow-black shadow-offset-[0px,2px] shadow-opacity-10 shadow-radius-5">
                            <SettingItem
                                icon="document-text-outline"
                                title="ନିୟମ ଏବଂ ସର୍ତ୍ତାବଳୀ"
                                subtitle="Terms of Services"
                                color="#FF8C00"
                            />
                            <SettingItem
                                icon="shield-checkmark-outline"
                                title="ଗୋପନୀୟତା ନୀତି"
                                subtitle="Privacy Policy"
                                color="#4CAF50"
                            />
                        </View>
                    </View>

                    {/* Support Section */}
                    <View className="mb-[25px]">
                        <Text className="text-sm font-bold text-[#666] mb-2.5 ml-[5px] uppercase tracking-widest">ସହାୟତା (Support)</Text>
                        <View className="bg-white rounded-[20px] overflow-hidden elevation-4 shadow-black shadow-offset-[0px,2px] shadow-opacity-10 shadow-radius-5">
                            <SettingItem
                                icon="call-outline"
                                title="ଆମ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ"
                                subtitle="Contact Us"
                                color="#0288D1"
                            />
                            <SettingItem
                                icon="mail-outline"
                                title="ଇମେଲ୍ ସହାୟତା"
                                subtitle="Email Support"
                                color="#E91E63"
                            />
                        </View>
                    </View>

                    {/* App Info Section */}
                    <View className="mb-[25px]">
                        <Text className="text-sm font-bold text-[#666] mb-2.5 ml-[5px] uppercase tracking-widest">ଅନ୍ୟାନ୍ୟ (Others)</Text>
                        <View className="bg-white rounded-[20px] overflow-hidden elevation-4 shadow-black shadow-offset-[0px,2px] shadow-opacity-10 shadow-radius-5">
                            <SettingItem
                                icon="star-outline"
                                title="ଆପ୍‌କୁ ରେଟିଂ ଦିଅନ୍ତୁ"
                                subtitle="Rate our App"
                                color="#FBC02D"
                            />
                            <SettingItem
                                icon="share-social-outline"
                                title="ସାଙ୍ଗମାନଙ୍କ ସହିତ ସେୟାର କରନ୍ତୁ"
                                subtitle="Share with Friends"
                                color="#673AB7"
                            />
                        </View>
                    </View>

                    <Text className="text-center text-[#AAA] text-[12px] mt-2.5 mb-[30px]">ଉତ୍କଳ ଉଦୟ v1.0.0</Text>
                    <View className="h-[100px]" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
