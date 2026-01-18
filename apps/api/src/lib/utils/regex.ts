// Filteri ako koristnik pokuša unijeti štetne ili neprikladne sadržaje ubaciti u eksterne servise (npr. AI)., pa da se ne šalju takvi sadržaji tj. kako bi uštedio na troškovima API-ja.
export const violenceRegex =
  /(\b(?:hate|violence|drugs|terrorism|porn|illegal activities|suicide|self-harm)\b)/i;
