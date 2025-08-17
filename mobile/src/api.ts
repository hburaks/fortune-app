import { API_BASE_URL } from './config';

export type FortuneResponse = {
	fortuneText: string;
	meta: { mocked: boolean; timestamp: string };
};

export async function getFortune(name: string): Promise<FortuneResponse> {
	const resp = await fetch(`${API_BASE_URL}/fortune`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	});
	if (!resp.ok) {
		const text = await resp.text().catch(() => '');
		throw new Error(text);
	}
	return resp.json();
}
