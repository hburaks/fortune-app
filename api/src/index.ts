export type FortuneResponse = {
	fortuneText: string;
	meta: { mocked: boolean; timestamp: string };
};

const CORS_HEADERS: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

async function handleFortune(request: Request): Promise<Response> {
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

	const fortuneText =
		`${name} isminin enerjisi bugün parlak ve davetkâr. ` +
		`Yeni başlangıçlara açık ol, küçük bir adım bile büyük fırsatlara dönüşebilir. ` +
		`Kendine nazik ol ve sezgilerini takip et. Sadece eğlence amaçlıdır.`;

	const payload: FortuneResponse = {
		fortuneText,
		meta: { mocked: true, timestamp: new Date().toISOString() },
	};
	return jsonResponse(payload, { status: 200 });
}

export default {
	async fetch(request): Promise<Response> {
		const url = new URL(request.url);

		// CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		// Mock fortune endpoint
		if (request.method === 'POST' && url.pathname === '/fortune') {
			return handleFortune(request);
		}

		// Mevcut örnekler kalsın (isteğe bağlı)
		if (url.pathname === '/message') return textResponse('Hello, World!');
		if (url.pathname === '/random') return textResponse(crypto.randomUUID());

		return textResponse('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
