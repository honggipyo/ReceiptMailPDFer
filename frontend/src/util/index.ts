import { EmailColumns, EmailData, MAIL_TEMPLATES } from '@/constants';

export const getEmailExampleData = (selectedTemplate: string) => {
  switch (selectedTemplate) {
    case MAIL_TEMPLATES.receipt.name:
      return {
        columns: EmailColumns,
        data: EmailData,
      };
    default:
      return {
        columns: [],
        data: [],
      };
  }
};
