import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from './lib/apiClient';
import { BorderRadius, Colors, FontSizes, Spacing } from './lib/theme';

export default function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API からデータを取得
  const fetchGreeting = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGreeting();
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      // 開発環境のみログ出力
      if (__DEV__) {
        console.error('API エラー:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // コンポーネントマウント時に API を呼び出し
  useEffect(() => {
    fetchGreeting();
  }, [fetchGreeting]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-workers-monorepo</Text>
      <Text style={styles.subtitle}>Expo + Cloudflare Workers</Text>

      <View style={styles.content}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>API から読み込み中...</Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.errorText}>❌ {error}</Text>
            <TouchableOpacity style={styles.button} onPress={fetchGreeting}>
              <Text style={styles.buttonText}>再試行</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.message}>✅ {message}</Text>
            <TouchableOpacity style={styles.button} onPress={fetchGreeting}>
              <Text style={styles.buttonText}>再読み込み</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>API: http://localhost:8787</Text>
        <Text style={styles.infoText}>Client: http://localhost:8081</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.large,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xxxlarge,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    width: '100%',
  },
  loadingText: {
    marginTop: Spacing.medium,
    fontSize: FontSizes.medium,
    color: Colors.text.secondary,
  },
  message: {
    fontSize: FontSizes.large,
    color: Colors.text.primary,
    marginBottom: Spacing.xlarge,
    textAlign: 'center',
    paddingHorizontal: Spacing.large,
  },
  errorText: {
    fontSize: FontSizes.medium,
    color: Colors.status.error,
    marginBottom: Spacing.xlarge,
    textAlign: 'center',
    paddingHorizontal: Spacing.large,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxlarge,
    paddingVertical: Spacing.medium - 4,
    borderRadius: BorderRadius.medium,
  },
  buttonText: {
    color: Colors.backgroundWhite,
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  info: {
    position: 'absolute',
    bottom: Spacing.xxxlarge,
    alignItems: 'center',
  },
  infoText: {
    fontSize: FontSizes.small,
    color: Colors.text.tertiary,
    marginVertical: Spacing.xs,
  },
});
