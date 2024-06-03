import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import dotenv from 'dotenv';

dotenv.config();
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
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
