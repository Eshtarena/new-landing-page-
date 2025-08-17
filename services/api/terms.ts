import type { NextApiRequest, NextApiResponse } from 'next';

interface Section {
  id: string;
  title: string;
  content: string[];
}

interface TermsResponse {
  sections: Section[];
  lastUpdated: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TermsResponse>
) {
  const { locale = 'en' } = req.query;

  try {
    // Here you would typically fetch from your database
    // This is a mock response for demonstration
    const response = await fetch(`${process.env.API_URL}/terms?locale=${locale}`);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching terms:', error);
    res.status(500).json({
      sections: [],
      lastUpdated: new Date().toISOString()
    });
  }
} 