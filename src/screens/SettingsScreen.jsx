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
                    
                    {/* Sélecteur de langue */}
                    <LanguageSelector />
                    
                    {/* Mode système */}
                    {isArmed !== null && <SystemMode initialIsArmed={isArmed} />}
                    
                    {/* Éditeur du nom du système */}
                    <SystemNameEditor />
                    
                    {/* Éditeur des noms d'appareils */}
                    <DeviceNameEditor />
                    
                    {/* Additional settings cards */}
                    <GlassCard style={styles.infoCard}>
                        <Text style={styles.infoTitle}>{t('settings.about')}</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('settings.version')}</Text>
                            <Text style={styles.infoValue}>1.0.0</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('settings.lastUpdate')}</Text>
                            <Text style={styles.infoValue}>30/11/2025</Text>
                        </View>
                    </GlassCard>
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
    errorCard: {
        backgroundColor: colors.status.errorBg,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        marginBottom: spacing.md,
    },
    errorText: {
        ...typography.caption,
        color: colors.status.error,
    },
    infoCard: {
        marginTop: spacing.lg,
    },
    infoTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    infoLabel: {
        ...typography.caption,
        color: colors.text.muted,
    },
    infoValue: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.secondary,
    },
});
