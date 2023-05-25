import { collection, getDocs } from 'firebase/firestore';
import{ getEvents } from './EventsList';

jest.mock('./FirebaseApp', () => ({
    db: jest.fn(),
}));

const eventsData = [
    {
        data: () => ({
            name: 'Event 1',
            image: 'https://firebasestorage.googleapis.com/v0/b/meirim-b3c4f.appspot.com/o/settlements%2Fpetah_tiqwa.jpg?alt=media&token=9aeb3d03-92e1-4cba-9b93-182f8a97220b',
            date: 0
        }),
        id: 123
    },
];


jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn().mockImplementation(() => Promise.resolve({
        docs: eventsData.map(event => ({
            id: event.id,
            data: () => event,
        })),
    })),
}));
describe('EventsList component', () => {
    it('should fetch events from the database', async () => {
        // Mock Firestore collection and getDocs functions
        const mockCollection = collection;

        collection.mockReturnValue(mockCollection);
        getDocs.mockReturnValue({ docs: eventsData });

        const events = await getEvents();
        expect(events).toEqual([{ id: 123, name: 'Event 1' ,date:0, image:"https://firebasestorage.googleapis.com/v0/b/meirim-b3c4f.appspot.com/o/settlements%2Fpetah_tiqwa.jpg?alt=media&token=9aeb3d03-92e1-4cba-9b93-182f8a97220b"}]);
    });
});
