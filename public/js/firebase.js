import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = window.firebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save progress
export async function saveProgress(userId, data) {
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
}

// Function to get progress
export async function getProgress(userId) {
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
            walletStatus: 'none',
            walletAddress: '',
            speedUpgradeLevel: 1,
            speedUpgradePrice: 100,
            energyUpgradeLevel: 1,
            energyUpgradePrice: 50,
            curenerg: 100,
            maxenerg: 100,
            lastEnergyUpdate: Date.now(),
            currentEgg: null,
            clickCount: 0,
            completedTasks: [],
            inventoryItems: {}
        };
        await saveProgress(userId, initialData);
        return initialData;
    }
}
