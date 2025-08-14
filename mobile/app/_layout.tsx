import { Stack } from 'expo-router';

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{ title: 'İsim Falı' }}
			/>
			<Stack.Screen
				name="result"
				options={{ title: 'Fal Sonucu' }}
			/>
		</Stack>
	);
}
