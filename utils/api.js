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