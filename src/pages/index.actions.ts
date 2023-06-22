export const validateEmails = (emails: string[]): boolean => {
  if (!emails || !emails.length) {
    return false;
  }

  return emails.filter((e) => e.indexOf("@") === -1).length === 0;
};

export const errors: Record<string, string> = {
  to: "Invalid address. Make sure to provide valid email addresses.",
};

interface SendEmailProps {
  setIsLoading: (v: boolean) => void;
  onSuccess: (d: Record<string, unknown>) => void;
  template: Template;
  subject: string;
  emails: string[];
}

export const sendEmail = ({
  setIsLoading,
  onSuccess,
  emails,
  template,
  subject,
}: SendEmailProps) => {
  setIsLoading(true);

  const data: Record<string, string> = {};
  const form = document.querySelector("#manual-email-form") as HTMLFormElement;

  template.variables?.forEach((variable) => {
    const { value } = form[`data[${variable}]`] || {};

    if (value) {
      data[variable] = value.replace(/\n/g, "<br/>");
    }
  });

  return fetch("/api/mail", {
    method: "POST",
    body: JSON.stringify({
      email: emails,
      templateId: template?.recordId,
      data,
      subject,
    }),
    headers: {
      Authorization: `Bearer ${localStorage.login}`,
    },
  })
    .then(async (res) => {
      const data = await res.json();
      onSuccess(data);
    })
    .finally(() => {
      setIsLoading(false);
    });
};
