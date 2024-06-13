const eggs = [
    { name: "Svinstvo Egg", icon: "public/images/myficalEggs/SvinstvoEgg.png", rarity: "Myfical", strength: 10000, minting: "maybe" },
    { name: "Rubin Egg", icon: "public/images/rareEggs/RubinEgg.png", rarity: "Secret", strength: 2600, minting: "no" },
    { name: "Topaz Egg", icon: "public/images/secretEggs/topazEgg.png", rarity: "Secret", strength: 2400, minting: "no" },
    { name: "Golden Egg", icon: "public/images/uncommonEggs/goldenEgg.png", rarity: "Rare", strength: 900, minting: "no" },
    { name: "Opal Egg", icon: "public/images/rareEggs/opalEgg.png", rarity: "Rare", strength: 1100, minting: "no" },
    { name: "Silver Egg", icon: "public/images/uncommonEggs/silverEgg.png", rarity: "Uncommon", strength: 500, minting: "no" },
    { name: "Buliiga Egg", icon: "public/images/commonEggs/buliigaEgg.png", rarity: "Common", strength: 99, minting: "no" },
    { name: "Bronze Egg", icon: "public/images/commonEggs/bronzeEgg.png", rarity: "Common", strength: 100, minting: "no" }
    // Добавьте сколько угодно объектов с данными о яйцах
];
function findEggByName(eggName) {
    return eggs.find((egg) => egg.name === eggName);
}