import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';

dotenv.config();

const clearNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Notification.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} old notifications`);
    
    console.log('\n✨ GIẢI PHÁP:');
    console.log('1. Đăng XUẤT khỏi web');
    console.log('2. Xóa localStorage: F12 → Console → localStorage.clear()');
    console.log('3. Đăng NHẬP lại');
    console.log('4. Tạo task MỚI và assign cho ai đó');
    console.log('5. Notification MỚI sẽ hoạt động đúng!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

clearNotifications();
