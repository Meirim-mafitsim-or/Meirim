import { db } from "./FirebaseApp";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";

export async function getCampers() {
    const campersRef = collection(db, "campers");
    const campersSnapshot = await getDocs(campersRef);
    const campers = campersSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    return campers;
}

export async function addCamper(camper) {
    try {
        const docRef = collection(db, 'campers');
        await setDoc(doc(docRef), camper);
    } catch (error) {
        console.error(error);
    }
}

export async function deleteCamper(camperId) {
    try {
        const docRef = doc(db, 'campers', camperId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(error);
    }
}

export async function updateCamper(camperId, camper) {
    try {
        console.log(camperId, camper);
        const docRef = doc(db, 'campers', camperId);
        await setDoc(docRef, camper, { merge: true });
    } catch (error) {
        console.error(error);
    }
}