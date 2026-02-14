/**
 * Send contact form data to the backend API
 * @param {Object} data - The form data
 * @param {string} data.name - Full name of the contact
 * @param {string} data.email - Email address
 * @param {Object} data.country - Selected country object with value and label
 * @param {string} data.phone - Phone number in international format
 * @param {string} data.message - Message content
 * @returns {Promise} - Resolves with the response data or rejects with error
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.eshtarena.com';

export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/contact-us`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit form');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to submit form');
  }
};

/**
 * Fetch social media links and app store links from the API
 * @returns {Promise<{social: Array, google: string, apple: string}>} - Resolves with the social media and app store links
 */
export const fetchSocialLinks = async () => {
  try {
    const response = await fetch('https://api.eshtarena.com/v1/about/links/');
    if (!response.ok) {
      throw new Error('Failed to fetch social links');
    }
    const data = await response.json();
    
    // Get the data from the about object and process social media logos
    const aboutData = data.about || {};
    const socialWithLogos = (aboutData.social || []).map(item => ({
      ...item,
      logo: `https://api.eshtarena.com/public/advice/${item.logo}`
    }));
    
    // Return the data with the expected structure
    return {
      social: socialWithLogos,
      apple: aboutData.apple || '',
      google: aboutData.google || ''
    };
  } catch (error) {
    console.error('Error fetching social links:', error);
    return {
      social: [],
      apple: '',
      google: ''
    };
  }
};

/**
 * Submit supplier request form data to the backend API
 * @param {Object} formData - The form data
 * @param {string} formData.companyName - Company name
 * @param {string} formData.category - Category
 * @param {string} formData.businessEmail - Business email
 * @param {string} formData.phoneNumber - Phone number
 * @param {string} formData.headquarters - Headquarter address
 * @param {Object} formData.contactPerson - Contact person information
 * @param {string} formData.contactPerson.name - Contact person name
 * @param {string} formData.contactPerson.title - Contact person title
 * @param {string} formData.contactPerson.email - Contact person email
 * @param {string} formData.contactPerson.phone - Contact person phone
 * @param {string} formData.contactPerson.message - Message
 * @returns {Promise} - Resolves with the response data or rejects with error
 */
export const submitSupplierRequest = async (formData) => {
  try {
    // Map form data to API request body format
    const requestBody = {
      companyName: formData.companyName,
      category: formData.category,
      businessEmail: formData.businessEmail,
      phoneNumber: formData.phoneNumber,
      headQuarterAddress: formData.headquarters, // Map headquarters to headQuarterAddress
      contactPerson: {
        name: formData.contactPerson.name,
        title: formData.contactPerson.title,
        email: formData.contactPerson.email,
        phoneNumber: formData.contactPerson.phone, // Map phone to phoneNumber
      },
      message: formData.contactPerson.message,
    };

    const response = await fetch(`${API_BASE_URL}/v1/supplierrequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Handle error response (400)
      const errorMessage = responseData.error || 'Failed to submit supplier request';
      throw new Error(errorMessage);
    }

    // Handle success response (200)
    if (responseData.message === 'success') {
      return responseData;
    }

    throw new Error('Unexpected response from server');
  } catch (error) {
    throw new Error(error.message || 'Failed to submit supplier request');
  }
}; 