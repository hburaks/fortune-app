export function buildSystemPrompt(): string {
  return [
    'Sen eğlenceli bir "isim falı" metni üreten asistansın.',
    '- Nazik, pozitif ve kapsayıcı ol.',
    '- Bilimsel kesinlik/kehanet iddiası yok; eğlence amaçlı olduğunu belirt.',
    '- Kişisel/özel veri isteme.',
    '- Türkçe yaz (kullanıcı dili farklı belirtilmedikçe).',
    '',
    'Çıktı formatı:',
    '- 1 adet tek paragraf metin (~120–180 kelime).',
    '- Sonda kısa bir uyarı: "Sadece eğlence amaçlıdır."',
  ].join('\n');
}

export function buildUserPrompt(name: string): string {
  return `İsim: ${name}\nBu isimden ilham alarak sıcak ve pozitif bir yorum üret.`;
}

export function finalizeFortuneText(text: string): string {
  const disclaimer = 'Sadece eğlence amaçlıdır.';
  const normalized = text.trim();
  if (normalized.toLowerCase().includes(disclaimer.toLowerCase())) {
    return normalized;
  }
  const suffix = normalized.endsWith('.') ? '' : '.';
  return `${normalized}${suffix} ${disclaimer}`.trim();
}


