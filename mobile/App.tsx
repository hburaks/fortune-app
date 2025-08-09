import React, { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { getFortune } from './src/api';

export default function App() {
	const [name, setName] = useState('');
	const [result, setResult] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	const onSubmit = async () => {
		setErr(null);
		setResult(null);
		const trimmed = name.trim();
		if (trimmed.length < 2) {
			setErr('İsim en az 2 karakter olmalı');
			return;
		}
		try {
			setLoading(true);
			const data = await getFortune(trimmed);
			setResult(data.fortuneText);
		} catch (e: any) {
			setErr(e?.message || 'Hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text style={{ fontSize: 20, fontWeight: '600' }}>İsim Falı (Dev)</Text>

			<TextInput
				placeholder="İsmini yaz"
				value={name}
				onChangeText={setName}
				autoCapitalize="words"
				style={{
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 12,
					borderRadius: 8
				}}
			/>

			<Button
				title={loading ? 'Yükleniyor...' : 'Falını Al'}
				disabled={loading}
				onPress={onSubmit}
			/>

			{err ? <Text style={{ color: 'red' }}>{err}</Text> : null}
			{result ? (
				<View
					style={{ padding: 12, backgroundColor: '#f8f8f8', borderRadius: 8 }}
				>
					<Text>{result}</Text>
				</View>
			) : null}
		</SafeAreaView>
	);
}
