import React, { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

export default function NameInputScreen() {
	const [name, setName] = useState('');

	const onSubmit = () => {
		const trimmed = name.trim();
		if (trimmed.length < 2) {
			alert('İsim en az 2 karakter olmalı');
			return;
		}
		// Sonuç ekranına git
		router.push(`/result?name=${encodeURIComponent(trimmed)}`);
	};

	return (
		<SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text style={{ fontSize: 20, fontWeight: '600' }}>İsim Falı</Text>

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
				title="Falını Al"
				onPress={onSubmit}
			/>
		</SafeAreaView>
	);
}
