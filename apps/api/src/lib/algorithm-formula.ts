// Pirncip svih ovih algoritama je da se postovima dodijeli neki score (bodovna vrijednost)
// Na osnovu tog rezultata se onda postovi rangiraju i prikazuju korisnicima tj. bit će sortirani po tom score-u

export function calculatePostRankingScore(input: {
  likes: number;
  comments: number;
  images: number;
  orgFollowers: number;
  isAuthorPro: boolean;
  isOrgPro: boolean;
  createdAt: Date;
}): number {
  // Formula je bazirana na ovom principu tj. ideji. Upravljamo s faktorima koji već imaju neke predefinirane težine.  :
  const rankingWeights = {
    likes: 1.0,
    comments: 2.0,
    images: 0.3,
    orgFollowers: 0.4,
    authorPremium: 1.5,
    orgPremium: 1.0,
    decayHalfLife: 48,
  };
  const now = Date.now();
  const ageHours = (now - input.createdAt.getTime()) / 3_600_000;

  // Ideja ovog algoritma je da ne množimo s prevelikim brojevima nego da koristimo logaritamske funkcije i korjene koje će smanjiti utjecaj prevelikih razlika vrijednosti. Također oslanjamo se dosta na vremenski utjecaj (decay) kako bi stariji postovi imali manji score, tj. želimo da noviji postovi budu favorizirani.
  // Vrijednosti ovih postova kruže između 0 i nekog većeg broja, ali zbog logaritamskih funkcija i korjena, razlike između vrlo visokih vrijednosti su smanjene.

  // Za sudjelovanje posta, gledamo koliko ima lajkova, komentara i slika.

  const engagement =
    rankingWeights.likes * Math.log1p(input.likes) +
    rankingWeights.comments * Math.log1p(input.comments) +
    rankingWeights.images * input.images;

  const authority =
    rankingWeights.orgFollowers * Math.log1p(input.orgFollowers);

  const premium =
    (input.isAuthorPro ? rankingWeights.authorPremium : 0) +
    (input.isOrgPro ? rankingWeights.orgPremium : 0);

  const engagementBoost =
    Math.sqrt(Math.max(0, engagement)) *
    Math.sqrt(1 + input.comments / Math.max(1, input.likes));

  const authorityBoost = Math.log1p(Math.max(0, authority));

  const interactionTerm = Math.sqrt(Math.max(0, engagement * authority));

  const premiumMultiplier =
    1 + premium / (1 + Math.sqrt(Math.max(1, authority)));

  return (
    ((engagementBoost + authorityBoost + interactionTerm) * premiumMultiplier) /
      1 +
    Math.sqrt(ageHours / rankingWeights.decayHalfLife)
  );
}
