import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from './lib/apiClient';
import { BorderRadius, Colors, FontSizes, Spacing } from './lib/theme';

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  // 要約実行
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      Alert.alert('エラー', 'テキストを入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSummary('');

      const response = await api.summarize(inputText);

      if (response.success && response.data) {
        setSummary(response.data.summary);
        setRemainingCount(response.remainingCount ?? null);
      } else {
        setError(response.error || '要約に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '要約処理中にエラーが発生しました');
      if (__DEV__) {
        console.error('要約エラー:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xにシェア（クリップボードにコピー）
  const handleShare = async () => {
    if (!summary) {
      Alert.alert('エラー', '要約結果がありません');
      return;
    }

    try {
      await Clipboard.setStringAsync(summary);
      Alert.alert('✅ コピー完了', 'クリップボードにコピーしました！\nXアプリで投稿できます。');
    } catch (err) {
      Alert.alert('エラー', 'コピーに失敗しました');
      if (__DEV__) {
        console.error('コピーエラー:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>🐦 X風要約AI</Text>
        <Text style={styles.subtitle}>長文をXの投稿に最適化</Text>

        {/* 利用制限の案内 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>💡 無料版のため、1日に要約できるのは3回までです</Text>
          {remainingCount !== null && (
            <Text style={styles.remainingText}>残り {remainingCount} 回</Text>
          )}
        </View>

        {/* 入力エリア */}
        <View style={styles.section}>
          <Text style={styles.label}>📝 長文を入力</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={8}
            placeholder="要約したい長文をここに入力してください...\n\n例: ブログ記事、ニュース、論文の要約など"
            placeholderTextColor={Colors.text.tertiary}
            value={inputText}
            onChangeText={setInputText}
            editable={!loading}
          />
          <Text style={styles.charCount}>{inputText.length} 文字</Text>
        </View>

        {/* 要約ボタン */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleSummarize}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.backgroundWhite} />
          ) : (
            <Text style={styles.buttonText}>✨ 要約する</Text>
          )}
        </TouchableOpacity>

        {/* エラー表示 */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {/* 要約結果 */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.label}>✅ 要約結果</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{summary}</Text>
              <Text style={styles.summaryCharCount}>{summary.length} / 280 文字</Text>
            </View>

            {/* Xにシェアボタン */}
            <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
              <Text style={styles.shareButtonText}>📋 クリップボードにコピー</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Cloudflare Workers AI</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.large,
    paddingTop: Platform.OS === 'web' ? Spacing.xlarge : Spacing.xxxlarge,
  },
  title: {
    fontSize: FontSizes.xxlarge,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xxlarge,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    marginBottom: Spacing.large,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  infoText: {
    fontSize: FontSizes.small,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  remainingText: {
    fontSize: FontSizes.medium,
    color: '#1B5E20',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xlarge,
  },
  label: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.small,
  },
  textArea: {
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1,
    borderColor: Colors.text.tertiary,
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    fontSize: FontSizes.medium,
    color: Colors.text.primary,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: FontSizes.small,
    color: Colors.text.tertiary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  button: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.xlarge,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.medium,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.backgroundWhite,
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE',
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: FontSizes.medium,
  },
  summaryBox: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  summaryText: {
    fontSize: FontSizes.medium,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  summaryCharCount: {
    fontSize: FontSizes.small,
    color: Colors.text.tertiary,
    textAlign: 'right',
    marginTop: Spacing.small,
  },
  shareButton: {
    backgroundColor: '#1DA1F2', // X (Twitter) blue
  },
  shareButtonText: {
    color: Colors.backgroundWhite,
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  footer: {
    marginTop: Spacing.xlarge,
    paddingVertical: Spacing.xlarge,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.small,
    color: Colors.text.tertiary,
  },
});

// 旧 UI のスタイル定義は削除し、新しい要約UI用スタイルのみ保持
