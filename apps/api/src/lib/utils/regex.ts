// Filteri ako koristnik pokuša unijeti štetne ili neprikladne sadržaje ubaciti u eksterne servise (npr. AI)., pa da se ne šalju takvi sadržaji tj. kako bi uštedio na troškovima API-ja.
export const violenceRegex =
  /(\b(?:hate|violence|drugs|porn|illegal activities|suicide|self-harm)\b)/i;

export const badLanguageRegex =
  /(\b(?:f[u*]ck(?:ing|er)?|sh[i!]t(?:ty|head)?|a\$\$|piss(?:ed)?|bitch(?:y|es)?|bastard|damn|hell)\b)/gi;
