import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { app, db, storage } from './FirebaseApp';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

describe('FirebaseApp', () => {
  it('should initialize the Firebase app', () => {
    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: "your-api-key",
      authDomain: "your-auth-domain",
      projectId: "your-project-id",
      storageBucket: "your-storage-bucket",
      messagingSenderId: "your-messaging-sender-id",
      appId: "your-app-id",
      measurementId: "your-measurement-id",
    });
  });

  it('should get the Firestore database instance', () => {
    expect(getFirestore).toHaveBeenCalledWith(app);
    expect(db).toBeDefined();
  });

  it('should get the Firebase storage instance', () => {
    expect(getStorage).toHaveBeenCalledWith(app);
    expect(storage).toBeDefined();
  });
});
