import axios from 'axios';
import FormData from 'form-data';

// Test product creation with image upload
const testProductCreation = async () => {
  try {
    const formData = new FormData();

    // Add product data
    formData.append('name', 'Test Product - Fixed Env Vars');
    formData.append('description', 'Testing product creation after fixing environment variable loading');
    formData.append('price', '149.99');
    formData.append('category', 'Test Category');
    formData.append('inStock', 'true');
    formData.append('stockQuantity', '5');

    // Create a simple test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    formData.append('images', testImageBuffer, {
      filename: 'test-fixed.png',
      contentType: 'image/png'
    });

    console.log('Testing product creation with fixed environment variables...');

    const response = await axios.post('http://localhost:5000/api/admin/products', formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });

    console.log('✅ SUCCESS: Product created successfully!');
    console.log('Product ID:', response.data._id);
    console.log('Image URL:', response.data.images[0]);

  } catch (error) {
    console.error('❌ FAILED: Error creating product:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testProductCreation();