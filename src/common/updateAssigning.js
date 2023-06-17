import { db } from "./FirebaseApp";
import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import {getEvents} from './Database'

export default async function  updateAssigning()  {
    const events = await getEvents();

    // Get the current date and time
    const currentDate = new Date();

    // Iterate through the events and check if the event date is over
    for (const event of events) {
        const eventDate = new Date(event.date.seconds * 1000);

        if (currentDate.getTime() > eventDate.getTime()) 
        {
            const registrationId = event.registrationId;
            const familiesRegCol = collection(db, 'familiesRegistration');
            const familiesReg = doc(familiesRegCol, registrationId);
            const familiesSnapshot = await getDoc(familiesReg);
            
            const settlement = event.settlement;
            const assigningCol = collection(db, 'assignings');
            const settlementDoc = doc(assigningCol, settlement);
            const settlementSnapshot = await getDoc(settlementDoc);

            if (!familiesSnapshot.exists() || !settlementSnapshot.exists()) {
                continue;
            }

            const familiesData = familiesSnapshot.data().families;
            const assigningsData = settlementSnapshot.data().assignings;


            const filteredData = familiesData.filter(obj => obj.confirmed === true && obj.assigning === true)
            .map(obj => ({
                family_name: obj.last_name,
                phone_number: obj.phone_number,
                camper: obj.camper
            }));
            
            
            filteredData.forEach(family => {
                const existingFamily = assigningsData.find(
                item =>
                    item.family_name === family.family_name &&
                    item.phone_number === family.phone_number
                );
                
                if (existingFamily) {
                    const hasObjectWithDate = assigningsData.some(obj => {
                        const objDate = new Date(obj.date);
                        return objDate.getTime() === eventDate.getTime();
                      });
                      if (!hasObjectWithDate) {
                        
                            existingFamily.campersID.push({id:family.camper, date: eventDate});
                        } else {
                        assigningsData.push({
                            family_name: family.family_name,
                            phone_number: family.phone_number,
                            campersID: [{id:family.camper, date: eventDate}]
                });
                }
            }
            });
            
            await updateDoc(settlementDoc, {
                assignings: assigningsData,
              });

        }
    };
}

    