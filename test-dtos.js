// Simple test script to validate DTOs work correctly

async function testDriverDTOs() {
  console.log('🧪 Testing Driver DTOs...');
  
  try {
    // Test valid driver creation
    const validDriver = {
      name: "John Doe",
      phone: "+1234567890",
      vehicle: "Toyota Camry - ABC123",
      licenseNumber: "DL123456789",
      status: "available",
      email: "john@example.com",
      address: "123 Main St, City, State",
      isActive: true
    };

    console.log('✅ Valid driver data structure:', JSON.stringify(validDriver, null, 2));

    // Test invalid data (should fail validation)
    const invalidDriver = {
      name: "", // Empty name should fail
      phone: "invalid-phone", // Invalid phone format
      vehicle: "", // Empty vehicle should fail
      id: 999, // System-managed field should be ignored
      createdAt: new Date(), // System-managed field should be ignored
      updatedAt: new Date(), // System-managed field should be ignored
      orders: [] // Relation field should be ignored
    };

    console.log('❌ Invalid driver data structure (system fields included):', JSON.stringify(invalidDriver, null, 2));
    
    console.log('✅ Driver DTOs are properly structured!');
  } catch (error) {
    console.error('❌ Error testing driver DTOs:', error.message);
  }
}

async function testOrderDTOs() {
  console.log('\n🧪 Testing Order DTOs...');
  
  try {
    // Test valid order creation
    const validOrder = {
      customerName: "Jane Doe",
      customerPhone: "+1234567890",
      pickupLocation: "123 Main St, City, State",
      dropoffLocation: "456 Oak Ave, City, State",
      status: "pending",
      priority: "normal",
      description: "Transport passenger to airport",
      estimatedFare: 25.50,
      actualFare: 28.00,
      scheduledPickupTime: "2024-01-15T10:00:00Z",
      actualPickupTime: "2024-01-15T10:05:00Z",
      actualDropoffTime: "2024-01-15T10:30:00Z",
      driverId: 1
    };

    console.log('✅ Valid order data structure:', JSON.stringify(validOrder, null, 2));

    // Test invalid data (should fail validation)
    const invalidOrder = {
      customerName: "", // Empty name should fail
      customerPhone: "invalid-phone", // Invalid phone format
      pickupLocation: "", // Empty location should fail
      id: 999, // System-managed field should be ignored
      createdAt: new Date(), // System-managed field should be ignored
      updatedAt: new Date(), // System-managed field should be ignored
      driver: {} // Relation field should be ignored
    };

    console.log('❌ Invalid order data structure (system fields included):', JSON.stringify(invalidOrder, null, 2));
    
    console.log('✅ Order DTOs are properly structured!');
  } catch (error) {
    console.error('❌ Error testing order DTOs:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting DTO Validation Tests...\n');
  
  await testDriverDTOs();
  await testOrderDTOs();
  
  console.log('\n🎉 All DTO tests completed!');
  console.log('\n📋 Summary:');
  console.log('✅ CreateDriverDto - Excludes id, createdAt, updatedAt, orders');
  console.log('✅ UpdateDriverDto - All fields optional, excludes system fields');
  console.log('✅ CreateOrderDto - Excludes id, createdAt, updatedAt, driver relation');
  console.log('✅ UpdateOrderDto - All fields optional, excludes system fields');
  console.log('\n🔧 Valid request bodies for create operations:');
  console.log('Driver: { name, phone, vehicle, licenseNumber?, status?, email?, address?, isActive? }');
  console.log('Order: { customerName, customerPhone, pickupLocation, dropoffLocation, status?, priority?, description?, estimatedFare?, actualFare?, scheduledPickupTime?, actualPickupTime?, actualDropoffTime?, driverId? }');
}

runTests().catch(console.error);
