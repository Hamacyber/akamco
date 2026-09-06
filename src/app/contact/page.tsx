import type { Metadata } from 'next';
import { ContactContent } from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact — Request a Proposal',
  description:
    'Contact Akamco Technologies to discuss your IT infrastructure, cybersecurity, or technology requirements. Request a proposal or schedule a call with our team.',
};

export default function ContactPage() {
  return <ContactContent />;
}
