import bcrypt from "bcryptjs";
import { storage } from "./storage";

async function initializeDefaultAdmin() {
  try {
    // Check if super admin already exists
    const existingAdmin = await storage.getUserByUsername("admin");
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create default super admin
    const hashedPassword = await bcrypt.hash("cyberlockx2025!", 12);
    const adminUser = await storage.createAdminUser({
      username: "admin",
      password: hashedPassword,
      fullName: "System Administrator",
      email: "admin@cyberlockx.xyz", 
      role: "super_admin"
    });

    console.log("✅ Default admin user created successfully");
    console.log("📧 Username: admin");
    console.log("🔐 Password: cyberlockx2025!");
    console.log("⚠️  Please change the default password after first login");
    
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDefaultAdmin();
}

export { initializeDefaultAdmin };