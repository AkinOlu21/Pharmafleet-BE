// services/notificationService.js
import Notification from '../models/notificationModel.js';

export const notifyPharmacy = async (pharmacyId, prescriptionId) => {
    try {
        const notification = new Notification({
            pharmacyId,
            prescriptionId,
            message: 'You have a new prescription to process',
            type: 'new_prescription'
        });
        await notification.save();
        console.log(`Notification created for pharmacy ${pharmacyId} for prescription ${prescriptionId}`);
    } catch (error) {
        console.error('Error in notifyPharmacy:', error);
    }
};

