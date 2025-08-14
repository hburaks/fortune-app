import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getFortune } from '../src/api';

export default function ResultScreen() {
	const { name } = useLocalSearchParams<{ name: string }>();
	const [result, setResult] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!name) {
			router.back();
			return;
		}

		getFortune(name)
			.then((data) => setResult(data.fortuneText))
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false));
	}, [name]);

	if (loading) return <Text>Yükleniyor...</Text>;
	if (error) return <Text>Hata: {error}</Text>;

	return (
		<SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text style={{ fontSize: 20, fontWeight: '600' }}>Fal Sonucu</Text>

			<View
				style={{ padding: 12, backgroundColor: '#f8f8f8', borderRadius: 8 }}
			>
				<Text>{result}</Text>
			</View>

			<Button
				title="Geri Git"
				onPress={() => router.back()}
			/>
		</SafeAreaView>
	);
}
