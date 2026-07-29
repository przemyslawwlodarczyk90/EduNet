export interface PhishingRedFlag {
  label: string;
  excerpt: string;
  explanation: string;
}

export interface PhishingExample {
  senderDisplayName: string;
  senderEmailDomain: string;
  subject: string;
  body: string;
  redFlags: PhishingRedFlag[];
}
