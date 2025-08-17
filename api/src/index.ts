import { buildSystemPrompt, buildUserPrompt, finalizeFortuneText } from './prompt';

interface Env {
	OPENAI_API_KEY: string;
	USE_MOCK_FOR_AI?: string;
}

export type FortuneResponse = {
	fortuneText: string;
	meta: { mocked: boolean; timestamp: string };
};

const CORS_HEADERS: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

function isValidName(name: string): boolean {
	if (name.length < 2 || name.length > 40) return false;
	// Unicode harf ve boşluklara izin ver (Türkçe karakterler dahil)
	return /^\p{L}+(?:[ '\-]\p{L}+)*$/u.test(name);
}

function jsonResponse(data: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(data), {
		...init,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			...CORS_HEADERS,
			...(init?.headers || {}),
		},
	});
}

function textResponse(text: string, init?: ResponseInit): Response {
	return new Response(text, {
		...init,
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			...CORS_HEADERS,
			...(init?.headers || {}),
		},
	});
}

function buildMockFortune(name: string): FortuneResponse {
	const fortuneText =
		`${name} isminin enerjisi bugün parlak ve davetkâr. ` +
		`Yeni başlangıçlara açık ol, küçük bir adım bile büyük fırsatlara dönüşebilir. ` +
		`Kendine nazik ol ve sezgilerini takip et. Sadece eğlence amaçlıdır.`;
	return { fortuneText, meta: { mocked: true, timestamp: new Date().toISOString() } };
}

function isMockEnabled(env: Env): boolean {
	const v = (env.USE_MOCK_FOR_AI || '').toLowerCase();
	return v === '1' || v === 'true';
}

async function handleFortune(request: Request, env: Env): Promise<Response> {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const name = typeof (body as any)?.name === 'string' ? (body as any).name.trim() : '';
	if (!isValidName(name)) {
		return jsonResponse({ error: 'Invalid name. Use 2–40 letters and spaces only.' }, { status: 400 });
	}

	// Geliştirme modu: flag açıksa OpenAI çağrısını atla ve doğrudan mock dön
	if (isMockEnabled(env)) {
		const payload = buildMockFortune(name);
		return jsonResponse(payload, { status: 200 });
	}

	// OpenAI çağrısı
	try {
		const system = buildSystemPrompt();
		const user = buildUserPrompt(name);

		const resp = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: system },
					{ role: 'user', content: user },
				],
				temperature: 0.7,
				max_tokens: 300,
			}),
		});

		if (!resp.ok) {
			const errText = await resp.text().catch(() => '');
			console.error('API error:', { status: resp.status, details: errText });
			return jsonResponse({ error: 'Hata oluştu. Lütfen daha sonra tekrar deneyin.'}, { status: 502 });
		}

		const data = await resp.json();
		const raw = data?.choices?.[0]?.message?.content ?? '';
		const fortuneText = finalizeFortuneText(String(raw || ''));

		const payload: FortuneResponse = {
			fortuneText,
			meta: { mocked: false, timestamp: new Date().toISOString() },
		};
		return jsonResponse(payload, { status: 200 });
	} catch (e) {
		return jsonResponse({ error: 'AI isteği başarısız oldu.' }, { status: 500 });
	}
}
export default {
	async fetch(request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		// Health check (secret varlığını sızdırmadan doğrula)
		if (request.method === 'GET' && url.pathname === '/health') {
			return jsonResponse({ ok: true, openaiConfigured: Boolean(env.OPENAI_API_KEY) });
		}

		// CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		// Fortune endpoint
		if (request.method === 'POST' && url.pathname === '/fortune') {
			return handleFortune(request, env);
		}

		// Mevcut örnekler kalsın (isteğe bağlı)
		if (url.pathname === '/message') return textResponse('Hello, World!');
		if (url.pathname === '/random') return textResponse(crypto.randomUUID());

		return textResponse('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
