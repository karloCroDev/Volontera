export function sortPairKey({
  senderId,
  recieverId,
}: {
  senderId: string;
  recieverId: string;
}) {
  return [senderId, recieverId].sort().join(":"); // Uvijek isti redoslijed korisnika bez obzira tko šalje poruku
}
