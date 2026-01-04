import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import connectDB from '../config/database.js';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateUsers = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Update all users that don't have isActive field
    const result = await User.updateMany(
      { isActive: { $exists: false } },
      { 
        $set: { 
          isActive: true 
        } 
      }
    );

    console.log(`Migration completed: ${result.modifiedCount} users updated with isActive: true`);

    // Update fullName from name if fullName doesn't exist
    const nameResult = await User.updateMany(
      { 
        fullName: { $exists: false },
        name: { $exists: true }
      },
      [
        { 
          $set: { 
            fullName: '$name'
          } 
        }
      ]
    );

    console.log(`Migration completed: ${nameResult.modifiedCount} users updated with fullName from name`);

    // Update avatar from image if avatar doesn't exist
    const avatarResult = await User.updateMany(
      { 
        avatar: { $exists: false },
        image: { $exists: true }
      },
      [
        { 
          $set: { 
            avatar: '$image'
          } 
        }
      ]
    );

    console.log(`Migration completed: ${avatarResult.modifiedCount} users updated with avatar from image`);

    // Show updated users
    const users = await User.find().select('name fullName email isSystemAdmin isActive');
    console.log('\nAll users after migration:');
    users.forEach(user => {
      console.log(`- ${user.fullName || user.name} (${user.email}): Admin=${user.isSystemAdmin}, Active=${user.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUsers();
