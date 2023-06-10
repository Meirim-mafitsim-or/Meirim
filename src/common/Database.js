import { db,firebaseConfig } from "./FirebaseApp";
import { collection, getDocs, setDoc, doc, deleteDoc,where, query,getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
export async function getEvents() {
    const EventsRef = collection(db, "events");
    const EventsSnapshot = await getDocs(EventsRef);
    const Events = EventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    return Events;
}

export async function getPic() {
    const picRef = collection(db, "carusels");
    const picSnapshot = await getDocs(picRef);
    const pic = picSnapshot.docs.map(doc => doc.data());
    return pic;
}

export async function getFamiliesRegistration() {
    const FamiliesRegistrationRef = collection(db, "familiesRegistration");
    const FamiliesRegistrationSnapshot = await getDocs(FamiliesRegistrationRef);
    const FamiliesRegistration = FamiliesRegistrationSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    return FamiliesRegistration;
  }

  export async function getFamilies(id) {
    const events = collection(db, 'events');
    const cur_event = doc(events, id);
    const EventsSnapshot = await getDoc(cur_event);
    const eventData = EventsSnapshot.data();
    return eventData.families || [];
  }

  export async function createCoordinator(coordinatorData, setError, onSuccessfulAdd,password) {
    const coordinator = collection(db, 'coordinators');
    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
    const tempAuth = getAuth(secondaryApp);

    createUserWithEmailAndPassword(tempAuth, coordinatorData.email, password).then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        tempAuth.signOut();

        const userCollection = collection(db, 'users');
        const userData = {
            ...coordinatorData,
            role: "coordinator",
        }
            
        await setDoc(doc(userCollection,user.uid), userData);

        coordinatorData.userId = user.uid;
        await setDoc(doc(coordinator), coordinatorData);
        onSuccessfulAdd();
      })
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
      });
}
export async function getEventById(eventId) {
    const EventsRef = collection(db, "events");
    const EventsSnapshot = await getDocs(EventsRef);
    const Events = EventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    const event = Events.filter(event => event.id === eventId);
    return event;
}

export async function getCampersById(campersIds) {
    const promises = campersIds.map((camperId) => {
        const camperRef = doc(db, "campers", camperId);
        return getDoc(camperRef);
    });
    const campers = await Promise.all(promises);
    let data =  campers.map((camper)=> Object.assign(camper.data(),{id:camper.id}));
    return data;
}


export async function getUser(user) {
    try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return Object.assign(user, docSnap.data());
        }
    } catch (error) {
        console.error(error);
    }
}

export async function addMessage(message) {
    try {
        const docRef = collection(db, 'messages');
        await setDoc(doc(docRef), message);
    } catch (error) {
        console.error(error);
    }
}

export async function getMessages() {
    const messagesRef = collection(db, "messages");
    const messagesSnapshot = await getDocs(messagesRef);
    const messages = messagesSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    return messages;
}