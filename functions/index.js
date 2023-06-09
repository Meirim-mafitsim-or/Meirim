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

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const config = require("./config.json");

initializeApp();

exports.sendMessages = onRequest((request, response) => {
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


exports.sendMessagesWithTemplate = onRequest((request, response) => {
    const {template, recipients} = request.body.data;
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
});