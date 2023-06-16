/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const onSchedule = require("firebase-functions/v2/scheduler");
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const { credential } = require("firebase-admin");
const config = require("./config.json");
var serviceAccount = require("./serviceAccountKey.json");
initializeApp({
    credential: credential.cert(serviceAccount)
  });
exports.sendmessages = onRequest((request, response) => {
    const {message, phone} = request.body.data;
    // console.log('Sending SMS to ' + phone + ' with message: ' + message);
    logger.info('Sending SMS to ' + phone + ' with message: ' + message, {structuredData: true});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", config.inforuAuthKey);

    var raw = JSON.stringify({
        "Data": {
            "Message": message,
            "Recipients": [
                {
                    "Phone": phone
                }
            ],
            "Settings": {
                "Sender": "Meirim",
            }
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://capi.inforu.co.il/api/v2/SMS/SendSms", requestOptions)
        .then(response => response.text())
        .then(result => {
            logger.info(result, {structuredData: true});
            response.send(result);
        })
        .catch(error => {
            logger.info(error, {structuredData: true});
            response.send(error);
        });
});


function sendMessagesWithTemplate(template, recipients, response) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", config.inforuAuthKey);

    var raw = JSON.stringify({
        "Data": {
            "Message": template,
            "Recipients": recipients,
            "Settings": {
                "Sender": "Meirim",
            }
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://capi.inforu.co.il/api/v2/SMS/SendSms", requestOptions)
        .then(response => response.text())
        .then(result => {
            logger.info(result, {structuredData: true});
            response.send(result);
        })
        .catch(error => {
            logger.info(error, {structuredData: true});
            response.send(error);
        });
}

exports.sendmessageswithtemplate = onRequest((request, response) => {
    const {template, recipients} = request.body.data;
    sendMessagesWithTemplate(template, recipients, response);
});

async function getFamiliesRegistrationByIds(familiesIds, familiesRegistrationId,db) {
    const familesRegistrationRef = db.collection("familiesRegistration").doc(familiesRegistrationId);
    const doc = await familesRegistrationRef.get();
    return doc.data().families.filter(family => familiesIds.includes(family.id));
}
async function getEvents(db) {
    events = await db.collection("events").get()
    events_res = [];
    events.forEach(doc => {
        events_res.push({...doc.data(), id: doc.id});
    });
    return events_res;
}

// Run once a day at midnight, to clean up the users
// Manually run the task here https://console.cloud.google.com/cloudscheduler
// exports.accountcleanup = onSchedule("every day 18:00", async (event) => {
exports.sendfeedbackrequest = onRequest(async (request, response) => {
    const db = getFirestore();
    let now = new Date();//get the date of today and add the events that are not over yet
    now = now.getTime() / 1000;
    const allEvents = await getEvents(db);
    const events = allEvents.filter(event => (event.date.seconds < now) && (now - event.date.seconds < 86400));
    const familiesId = events.map(event => event.families);
    const familesRegistration = events.map(event => event.registrationId);
    let familiesRegistrationByIds = [];
    let smsData = await  Promise.all(familiesId.map(async (families,i) => {
        familiesRegistrationByIds = await getFamiliesRegistrationByIds(families,familesRegistration[i],db);
        return familiesRegistrationByIds.map(family => ({phone_number: family.phone_number, id: family.id, event:events[i].id, name:family.first_name + " " + family.last_name}))
    }));
    // flatten smsData
    smsData = smsData.flat();
    console.log("smsData",smsData);
    const links = smsData.map(family => `${config.siteUrl}/FamiliesFeedback/${family.event}/${family.id}`);
    const template = "היי [#familyName#], תודה שהגעתם אתמול לשבת שלנו. נשמח לשמוע מכם חוויה קצרה על השבת. תודה רבה ושבוע טוב. [#link#]";
    const recipients = smsData.map((family,index) => ({
        Phone: family.phone_number, 
        familyName: family.name, 
        link: `${config.siteUrl}/FamiliesFeedback/${family.event}/${family.id}`
    }));
    sendMessagesWithTemplate(template, recipients,response);
  });