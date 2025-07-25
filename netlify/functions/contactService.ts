interface ContactData {
  name: string;
  email: string;
  phone: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

class ContactService {
  private readonly baseURL = process.env.NODE_ENV === 'production' 
    ? '/.netlify/functions' 
    : '/.netlify/functions';

  async submitContact(data: ContactData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${this.baseURL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Contact service error:', error);
      throw error;
    }
  }
}

export default new ContactService();