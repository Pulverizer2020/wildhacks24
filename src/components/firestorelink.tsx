// can run this inside of Searchbar with <FirestoreLink/>

import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { nanoid } from 'nanoid';
import { useSearchParams } from "react-router-dom";

const config = {
    apiKey: "AIzaSyDrkCcTA-x2YRWDg9irkpp41YfJ7Nllo1U",
    authDomain: "wildhacks24-1108b.firebaseapp.com",
    databaseURL: "https://wildhacks24-1108b-default-rtdb.firebaseio.com",
    projectId: "wildhacks24-1108b",
    storageBucket: "wildhacks24-1108b.appspot.com",
    messagingSenderId: "282904899307",
    appId: "1:282904899307:web:b67dd6eb5ad1577abd98ae"
};

const app = initializeApp(config);

const FirestoreLink: React.FC = () => {
    const [jsonString, setJSONString] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const db = getFirestore();
    const uuid = searchParams.get("uuid");

    useEffect(() => {


        if (uuid) {
            const docRef = doc(db, "mapValues", "OIDrsNY6z3KcQOYDJeMX");
            console.log("got the uuid " + uuid);
            getDoc(docRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const values = docSnapshot.data();
                    // Check if the UUID exists as a key in the document
                    if (values && values[uuid]) {
                        let jsonString = JSON.stringify(values[uuid], null, 2);
                        // Also update the jsonString state
                        setJSONString(jsonString);
                    } else {
                        // UUID key not found, set JSON string to default value ("{}")
                        setJSONString("{}");
                    }
                } else {
                    // Document doesn't exist
                    setJSONString("{}");
                }
            }).catch((error) => {
                console.error("Error fetching document: ", error);
                setJSONString("{}");
            });

        } else {
            // No UUID in URL, set JSON string to default value ("{}")
            setJSONString("{}");
        }
    }, []);
    const handleUpload = () => {

        // Generate a small UUID and update state
        const smallUUID = nanoid(8);
        setSearchParams({ uuid: smallUUID });

        // the document is named OIDrsNY6z3KcQOYDJeMX
        const docRef = doc(db, "mapValues", "OIDrsNY6z3KcQOYDJeMX"); // Replace "collectionName" with your actual collection name

        // Parsing JSON string 
        let jsonObject;
        try {
            jsonObject = JSON.parse(jsonString);
        } catch (error) {
            console.error("Invalid JSON string");
            return;
        }

        setDoc(docRef, { [smallUUID]: jsonObject }, { merge: true })
            .then(() => console.log("Document successfully written!"))
            .catch((error) => console.error("Error writing document: ", error));
    };


    return (
        <div>
            <textarea
                className="text-black bg-white p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                value={jsonString} onChange={(e) => setJSONString(e.target.value)} />
            <button onClick={handleUpload}>Upload</button>
            {uuid && <p>Your URL: http://localhost:5173/map?uuid={uuid}</p>}
        </div>
    );
};

export default FirestoreLink;