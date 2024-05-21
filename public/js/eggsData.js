const eggs = [
    { name: "Rubin Egg", icon: "images/rareEggs/RubinEgg.png", rarity: "Rare", strength: 10, minting: "no" },
    { name: "Golden Egg", icon: "images/uncommonEggs/goldenEgg.png", rarity: "Uncommon", strength: 10, minting: "no" },
    { name: "Silver Egg", icon: "images/uncommonEggs/silverEgg.png", rarity: "Uncommon", strength: 10, minting: "no" },
    { name: "Bronze Egg", icon: "images/commonEggs/bronzeEgg.png", rarity: "Common", strength: 10, minting: "no" }
    // Добавьте сколько угодно объектов с данными о яйцах
];
function findEggByName(eggName) {
    return eggs.find((egg) => egg.name === eggName);
}