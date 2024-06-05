import { initializeApp, cert, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCF0OddnnemkRaIWgMB7qiljOSK-nMAVYc",
  authDomain: "project-m-623e0.firebaseapp.com",
  projectId: "project-m-623e0",
  storageBucket: "project-m-623e0.appspot.com",
  messagingSenderId: "402462860686",
  appId: "1:402462860686:web:295b5a3b975f4a54a030df",
  measurementId: "G-7M5FEH7YCJ",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const userCollectionRef = collection(db, "users");
const chatCollectionRef = collection(db, "chats");

export const signUp = async (creds) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      creds.email,
      creds.password
    );
    console.log("User created and signed in:", userCredential.user);
    await sendEmailVerification(auth.currentUser);
    const userDetails = {
      name: creds.name,
      surname: creds.surname,
      username: creds.username,
      profileImage: creds.image || "",
      phoneNumber: creds.phoneNumber,
      age: creds.age,
      gender: creds.gender,
      description: creds.description,
      createdAt: new Date(),
    };
    console.log(userCredential.user);
    await setDoc(doc(db, "users", userCredential.user.uid), userDetails);
  } catch (error) {
    console.error("Sign up error:", error);
    // More specific error handling can be implemented here
    if (error.code === "auth/email-already-in-use") {
      throw new Error("email");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("email");
    } else {
      throw new Error("Failed to sign up. Please try again later.");
    }
  }
};

export const logIn = async (creds) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      creds.email,
      creds.password
    );
    const userDocRef = doc(userCollectionRef, userCredential.user.uid);
    const docSnapshot = await getDoc(userDocRef);
    const userProp = { ...docSnapshot.data() };

    console.log("User signed in:", userProp);
    return userProp;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out");
  } catch (error) {
    new Error(console.log("error: user was not found"));
  }
};
export const getChat = async (chatId) => {
  try {
    const q = query(chatCollectionRef, where("id", "==", chatId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const chatDocRef = querySnapshot.docs[0].data();
      console.log("Document with chatId: ", chatId, " has been retrieved");
      return chatDocRef;
    } else {
      console.log("No document found with chatId: ", chatId);
    }
  } catch (e) {
    console.error("Error retrieving document: ", e);
  }
};
export const writeComment = async (comment, chatId, username) => {
  try {
    const q = query(chatCollectionRef, where("id", "==", chatId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No matching chat found");
      return;
    }

    const docRef = querySnapshot.docs[0].ref;
    const docData = (await getDoc(docRef)).data(); // Get the current document data

    // Assuming 'comments' is an array in the document
    const newComments = docData.comments
      ? [...docData.comments, { writerName: username, commentText: comment }]
      : [{ writerName: username, commentText: comment }];

    // Update the document with the new comments array
    await updateDoc(docRef, {
      comments: newComments,
    });
  } catch (e) {
    console.error("The comment was not sent to the server");
  }
};
export const getChats = async () => {
  try {
    const chatSnapshot = await getDocs(chatCollectionRef);
    const chatList = chatSnapshot.docs.map((doc) => doc.data());
    return chatList;
  } catch (error) {
    console.error("Error fetching chat data:", error);
    throw error;
  }
};

export const addChat = async (chatName, hostUsername, uuid) => {
  try {
    const chatRef = await addDoc(chatCollectionRef, {
      name: chatName,
      host: hostUsername,
      id: uuid,
    });
    console.log("Document written with ID: ", chatRef.id);
    return;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
export const removeChat = async (chatId) => {
  try {
    const q = query(chatCollectionRef, where("id", "==", chatId)); // Query the collection to find the document with the specific chatId
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming there's only one document with the specific chatId
      const chatDocRef = querySnapshot.docs[0].ref;
      await deleteDoc(chatDocRef); // Delete the document
      console.log("Document with chatId: ", chatId, " has been deleted");
    } else {
      console.log("No document found with chatId: ", chatId);
    }
  } catch (e) {
    console.error("Error removing document: ", e);
  }
};
export { auth };
