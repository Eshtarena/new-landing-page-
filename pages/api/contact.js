/**
 * API route handler for contact form submissions
 * This is a placeholder that you can replace with your actual API implementation
 */
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, country, phone, message, submittedAt } = req.body;

    // Validate required fields
    if (!name || !email || !country || !phone || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Here you would typically:
    // 1. Save to your database
    // 2. Send notification emails
    // 3. Integrate with your CRM or ticket system
    // 4. etc.

    // For now, we'll just log the submission and return success
    console.log('Contact form submission:', {
      name,
      email,
      country,
      phone,
      message,
      submittedAt,
    });

    // Return success response
    return res.status(200).json({
      message: 'Contact form submitted successfully',
      submissionId: Date.now().toString(), // You would typically use a real ID from your database
    });
  } catch (error) {
    console.error('Contact form API error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
} 