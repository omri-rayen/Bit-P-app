// screens/SettingsScreen.jsx
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SystemMode from '../components/systemMode';
import SystemNameEditor from '../components/SystemNameEditor';
import DeviceNameEditor from '../components/DeviceNameEditor';
import LanguageSelector from '../components/LanguageSelector';
import useSystemMode from '../hooks/useSystemMode';
import { useLanguage } from '../i18n/LanguageContext';
import Header from '../components/Header';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import { colors, typography, spacing } from '../theme/colors';

export default function SettingsScreen () {
    const { isArmed, loading, error } = useSystemMode();
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();

    return (
        <GradientBackground>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.contentContainer,
                    { paddingBottom: insets.bottom + spacing.xl }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <Header 
                    title={t('settings.title')} 
                    subtitle={t('settings.subtitle')}
                    loading={loading}
                />
                
                <View style={styles.content}>
                    {error && (
                        <GlassCard style={styles.errorCard}>
                            <Text style={styles.errorText}>{t('common.error')}: {error}</Text>
                        </GlassCard>
                    )}
                    
                    {/* Mode système */}
                    {isArmed !== null && <SystemMode initialIsArmed={isArmed} />}
                    
                    {/* Éditeur du nom du système */}
                    <View style={styles.sectionSpacing}>
                        <SystemNameEditor />
                    </View>
                    
                    {/* Éditeur des noms d'appareils */}
                    <DeviceNameEditor />
                    
                    {/* Sélecteur de langue */}
                    <View style={styles.sectionSpacing}>
                        <LanguageSelector />
                    </View>
                    
                    {/* Version de l'application - tout en bas */}
                    <View style={styles.versionContainer}>
                        <Text style={styles.versionText}>Bit-P App</Text>
                        <Text style={styles.versionNumber}>v1.0.0</Text>
                    </View>
                </View>
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: spacing.lg,
    },
    sectionSpacing: {
        marginTop: spacing.xl,
    },
    errorCard: {
        backgroundColor: colors.status.errorBg,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        marginBottom: spacing.md,
    },
    errorText: {
        ...typography.caption,
        color: colors.status.error,
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: spacing.xl * 2,
        paddingVertical: spacing.lg,
    },
    versionText: {
        ...typography.caption,
        color: colors.text.muted,
        marginBottom: spacing.xs,
    },
    versionNumber: {
        ...typography.small,
        color: colors.text.muted,
        opacity: 0.6,
    },
});
