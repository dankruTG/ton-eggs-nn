import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";


// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyBtaQXXyMt2Cf5EJVbR-TW4lztiyvdIcgI",
    authDomain: "ton-eggs.firebaseapp.com",
    projectId: "ton-eggs",
    storageBucket: "ton-eggs.appspot.com",
    messagingSenderId: "259366486455",
    appId: "1:259366486455:web:1b346a97bb31b3ef196832"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save progress
export async function saveProgress(userId, data) {
    showLoadingIndicator();
    const docRef = doc(db, "users", userId.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const existingData = docSnap.data();
        const newData = { ...existingData, ...data };
        console.log('Existing data:', existingData);
        console.log('New data to save:', newData);
        await setDoc(docRef, newData);
    } else {
        console.log('Creating new document with data:', data);
        await setDoc(docRef, data);
    }
    console.log('Progress saved');
    hideLoadingIndicator();
}

// Function to get progress
export async function getProgress(userId) {
    showLoadingIndicator();
    const docRef = doc(db, "users", userId.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document! Creating new user...');
        // Create a new user with initial data
        const initialData = {
            userId: userId.toString(),
            username: '',
            balance: 0,
            totalBalance: 0,
            totalDamage: 0,
            walletStatus: 'none',
            walletAddress: '',
            speedUpgradeLevel: 1,
            speedUpgradePrice: 100,
            energyUpgradeLevel: 1,
            energyUpgradePrice: 50,
            curenerg: 100,
            maxenerg: 100,
            lastEnergyUpdate: Date.now(),
            currentEgg: { name: "Bronze Egg", icon: "public/images/commonEggs/bronzeEgg.png", rarity: "Common", strength: 100, minting: "no" },
            clickCount: 0,
            completedTasks: [],
            inventoryItems: {},
            ccLevel: 1,
            ccUpgradePrice: 100
        };
        
        await saveProgress(userId, initialData);
        hideLoadingIndicator();
        return initialData;
        
    }
    
}
function showLoadingIndicator() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}