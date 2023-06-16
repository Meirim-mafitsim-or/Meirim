import { db } from "./FirebaseApp";
import { collection, doc, updateDoc } from 'firebase/firestore';
import {getEvents} from './Database'

export default async function  updateAssigning()  {
    const events = await getEvents();

    // Get the current date and time
    const currentDate = new Date();

    // Iterate through the events and check if the event date is over
    for (const event of events) {
        const eventDate = new Date(event.date.seconds * 1000);

        if (currentDate.getTime() > eventDate.getTime()) {

            try {
                 // Add a family to the assignings document
                const addFamilyToAssignings = async (camperID) => {
                    const { assigning, assigningsArray } = await getFamilyFromAssignings(settlement);
                    const collectionRef = collection(db, 'assignings');
                    const docRef = doc(collectionRef, settlement);
                    if (!assigning) {
                    // Create a new object with the selected family details
                    const newAssigning = {
                        familyName: selectedFamily.last_name,
                        phoneNumber: selectedFamily.phone_number,
                        campersId: [camperID],
                    };

                    // Add the new object to the assigningsArray
                    assigningsArray.push(newAssigning);

                    // Update the Firestore document
                    await updateDoc(docRef, { assignings: assigningsArray });

                    console.log('New object added to assigningsArray:', newAssigning);
                    } else {
                    if (!assigning.campersId.includes(camperID)) {
                        assigning.campersId.push(camperID);
                        await updateDoc(docRef, { assignings: assigningsArray });
                    }
                    }
                };

                                console.log('Firestore update completed successfully!');
                            } catch (error) {
                                console.error('Error updating Firestore:', error);
                            }
                            }
                        }
    };

    