import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
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
    const docRef = doc(db, "users", userId.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const existingData = docSnap.data();
        const newData = { ...existingData, ...data };
        await setDoc(docRef, newData);
    } else {
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
            username: userId.toString(), // Placeholder
            balance: 0,
            walletStatus: 'none',
            speedUpgradeLevel: 1,
            speedUpgradePrice: 100,
            energyUpgradeLevel: 1,
            energyUpgradePrice: 50,
            curenerg: 100,
            maxenerg: 100,
            inventoryItems: {},
            currentEgg: null,
            clickCount: 0,
            completedTasks: []
        };
        await saveProgress(userId, initialData);
        return initialData;
    }
}
