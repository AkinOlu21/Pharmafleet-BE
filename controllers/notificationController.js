// controllers/notificationController.js
import Notification from '../models/notificationModel.js';

export const getPharmacyNotifications = async (req, res) => {
    try {
        const pharmacyId = req.user._id; // Assuming you have pharmacy authentication middleware
        const notifications = await Notification.find({ pharmacyId, isRead: false })
            .sort('-createdAt')
            .populate('prescriptionId');

        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: "Error fetching notifications" });
    }
};
                                  
export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: "Error updating notification" });
    }
};