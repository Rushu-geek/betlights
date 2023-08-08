import db from '../firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';


const userCollectionRef = collection(db, 'users');

const paymentReqCollectionRef = collection(db, 'paymentRequests');

const paymentDetailsRef = collection(db, 'paymentDetails');

const websitesRef = collection(db, 'websites');

class UserDataService {

    addData = async (data, collection) => {
        return await addDoc(collection, data);
    }

    getAllData = (collection) => {
        return getDocs(collection);
    }

    deleteData = async (db, collection, id) => {
        const data = doc(db, collection, id);
        return await deleteDoc(data);
    }

    updateData = async (db, collection, id, data) => {
        const obj = doc(db, collection, id);
        return await updateDoc(obj, data);
    }

    addUser = (newUser) => {
        return addDoc(userCollectionRef, newUser);
    }

    updateUser = (userId, updatedUser) => {
        const user = doc(db, 'users', userId);
        return updateDoc(user, updatedUser);
    }

    addPaymentReq = (paymentReq) => {
        return addDoc(paymentReqCollectionRef, paymentReq);
    }

    updatePaymentReq = (paymentReqId, updatedPayment) => {
        const paymentReq = doc(db, 'paymentRequests', paymentReqId);
        return updateDoc(paymentReq, updatedPayment);
    }

    updatePaymentDetaila = (paymentDetailId, updatedPaymentDetails) => {
        const paymentDetails = doc(db, 'paymentDetails', paymentDetailId);
        return updateDoc(paymentDetails, updatedPaymentDetails);
    }

    deleteUser = (userId) => {
        const user = doc(db, 'users', userId);
        return deleteDoc(user);
    }

    getAllUsers = () => {
        return getDocs(userCollectionRef);
    }

    getAllPaymentRequests = () => {
        return getDocs(paymentReqCollectionRef);
    }

    getAllPaymentDetails = () => {
        return getDocs(paymentDetailsRef);
    }

    getAllWebsites = () => {
        return getDocs(websitesRef)
    }
    getUser = (userId) => {
        const user = doc(db, 'users', userId);
        return getDoc(user);
    }

    queryUser = async (data) => {
        const q = query(collection(db, "users"), where("email", "==", data));
        const docs = await getDocs(q);
        return docs;
    }

    queryUserByPhone = async (number) => {
        const q = query(collection(db, "users"), where("number", "==", number));
        const docs = await getDocs(q);
        return docs;
    }

    queryUserByUserName = async (number) => {
        const q = query(collection(db, "users"), where("userName", "==", number));
        const docs = await getDocs(q);
        return docs;
    }

    queryUserRequest = async (data) => {
        const q = query(collection(db, "paymentRequests"), where("email", "==", data));
        const docs = await getDocs(q);
        return docs;
    }

    queryUserIds = async (userId) => {
        const q = query(collection(db, 'paymentRequests'), where("userId", "==", userId), where("requestStatus", "==", true))
        const docs = await getDocs(q);
        return docs;
    }
}

export default UserDataService;