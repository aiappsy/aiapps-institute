import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      admin.initializeApp({
        projectId: projectId || "aiapps-institute",
      });
    }
  } catch (err) {
    console.warn("Firebase admin initialization warning:", err);
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
