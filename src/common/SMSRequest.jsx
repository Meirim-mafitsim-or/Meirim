import React, { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://capi.inforu.co.il/api/v2/SMS/SendSms';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Your Base Credentials',
      };
      const data = {
        "Message": "Hello [#FirstName#] [#LastName#], reminder for meeting with [#Representative#]",
       
        "Recipients": [ // its better to do one reception and bring them as a list from the DB
            {
                "FirstName": "Jon",
                "LastName": "Smith",
                "Representative": "David",
                "Phone": "0541234567"
            },
            {
                "FirstName": "Danni",
                "LastName": "levi",
                "Representative": "Mike",
                "Phone": "0581234567"
            }
        ],
        "GroupNumbers": [
            {
                "GroupNumber": 7
            }
        ],
        "ExcludeGroupNumbers": [
            {
                "GroupNumber": 29
            }
        ],
        "Settings": {
            "Sender": "info",
            "CampaignName": "Advance sending",
            "TimeToSend": "2022-11-13 13:00:00",
            "DelayInSeconds": 10,
            "CustomerMessageID": "AF7864348",
            "CustomerParameter": "sms",
            "DeliveryNotificationUrl": "https://mysite.co.il/DeliveryNotification.aspx",
            "Priority": 0,
            "MaxSegments": 0,
            "IgnoreUnsubscribeCheck": false,
            "ExpireDate": "2022-11-13 13:00:00",
            "IgnorePossibleSendingTime": false,
            "CheckTimeRestiction": false,
            "ShortenUrlEnable": true,
            "AllowDuplicates": false
        }
    
      };

      try {
        const response = await fetch(url, {
          method: 'POST', // or 'GET', 'PUT', etc.
          headers: headers,
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Request was successful (status code in the 200-299 range)
          const jsonResponse = await response.json();
          console.log('Response:', jsonResponse);
        } else {
          // Request was not successful
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return <div>HTTP Request Example</div>;
};

export default MyComponent;

////Response should look as follows.
/**
 * {
  "StatusId": 1,
  "StatusDescription": "Success",
  "DetailedDescription": "",
  "FunctionName": "api/v2/SMS/SendSms",
  "RequestId": ",,Abh5mclRnbp5Sdy9mZulmLkV3bsNWPl1WYOR3cvhkJyETQzUyN1E0MlATMrgTMtATMtEjMwITPw1WY0NVZtlGVmQDNyQDNwETPklkclNXV",
  "Data": {
    "Recipients": 1,
    "Errors": null
  }
}
 */