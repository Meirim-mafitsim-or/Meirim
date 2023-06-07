import { db } from "./FirebaseApp";
import { collection, getDocs, setDoc, doc, deleteDoc,where, query } from "firebase/firestore";

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
        const docRef = doc(db, 'campers', camperId);
        await setDoc(docRef, camper, { merge: true });
    } catch (error) {
        console.error(error);
    }
}
//all the function above do the same with the coordinators

export async function getCoordinators() {
    const coordinatorsRef = collection(db, "users");
    const q = query(coordinatorsRef, where("role", "==", "coordinator"));
    const coordinatorsSnapshot = await getDocs(q);
    const coordinators = coordinatorsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    return coordinators;
}

export async function addCoordinator(coordinator) {
    try {
        const docRef = collection(db, 'users');
        coordinator.role = "coordinator";
        await setDoc(doc(docRef), coordinator);
    } catch (error) {
        console.error(error);
    }
}

export async function deleteCoordinator(coordinatorId) {
    try {
        const docRef = doc(db, 'users', coordinatorId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(error);
    }
}

export async function updateCoordinator(coordinatorId, coordinator) {
    try {
        const docRef = doc(db, 'users', coordinatorId);
        await setDoc(docRef, coordinator, { merge: true });
    } catch (error) {
        console.error(error);
    }
}


