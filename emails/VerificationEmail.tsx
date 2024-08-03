import * as React from 'react';
import {Html,Head,Font,Preview,Heading,Row,Section,Text,Button} from '@react-email/components';
interface EmailTemplateProps {
  username: string;
  otp:string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    username,otp,
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
  </div>
);
