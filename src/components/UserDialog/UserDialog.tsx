import { FormEventHandler, useEffect, useState } from "react";
import { StatusCodes } from "http-status-codes";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/lab/LoadingButton";
import { useTheme } from "@mui/material/styles";
import { fetcher } from "~/utils";

interface Props {
  open: boolean;
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}

const errors: Record<string, string> = {
  email: "Email is a required field.",
  attributes: "Cannot parse JSON. Make sure attributes is a valid JSON.",
  generic: "Something went wrong while submitting the form.",
};

export default function UserDialog({ open, user, onClose, onSuccess }: Props) {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(user?.email);
  const [userFirstName, setUserFirstName] = useState(user?.firstName);
  const [userLastName, setUserLastName] = useState(user?.lastName);
  const [userAttributes, setUserAttributes] = useState(
    user?.attributes ? JSON.stringify(user.attributes) : undefined
  );

  useEffect(() => {
    setUserEmail(user?.email);
    setUserFirstName(user?.firstName);
    setUserLastName(user?.lastName);
    setUserAttributes(
      user?.attributes ? JSON.stringify(user.attributes) : undefined
    );
  }, [user]);

  const fields = [
    {
      label: "Email",
      name: "email",
      value: userEmail,
      autoFocus: true,
      onChange: setUserEmail,
    },
    {
      label: "First name",
      name: "firstName",
      value: userFirstName,
      onChange: setUserFirstName,
    },
    {
      label: "Last name",
      name: "lastName",
      value: userLastName,
      onChange: setUserLastName,
    },
    {
      label: "Attributes",
      name: "attributes",
      value: userAttributes,
      onChange: setUserAttributes,
      multiline: true,
      description: (
        <Box sx={{ mt: 1, color: "white", opacity: 0.75, fontSize: 14 }}>
          Use this field to store additional data on the user.
        </Box>
      ),
    },
  ];

  const handleFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    let parsedAttributes = {};

    if (!userEmail?.trim()) {
      errs.email = errors.email;
    }

    if (userAttributes?.trim()) {
      try {
        parsedAttributes = JSON.parse(userAttributes.trim());
      } catch {
        errs.attributes = errors.attributes;
      }
    }

    setFormErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    setIsLoading(true);

    fetcher("/api/subscriber", {
      method: user ? "PATCH" : "POST",
      body: {
        recordId: user?.recordId,
        email: userEmail?.trim(),
        firstName: userFirstName?.trim(),
        lastName: userLastName?.trim(),
        attributes: parsedAttributes,
      },
    })
      .then(async (res) => {
        if (res.status === StatusCodes.CREATED) {
          setUserAttributes(undefined);
          setUserEmail(undefined);
          setUserFirstName(undefined);
          setUserLastName(undefined);
          onSuccess();
        } else if (res.status === StatusCodes.BAD_REQUEST) {
          const { errors } = (await res.json()) as {
            errors: Record<string, string>;
          };

          setFormErrors(errors);
        } else {
          setFormErrors({ generic: errors.generic });
        }
      })
      .catch(() => {
        setFormErrors({ generic: errors.generic });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hasFormError = formErrors && Object.keys(formErrors).length > 0;

  return (
    <Drawer
      open={open}
      onClose={() => onClose()}
      anchor="right"
      PaperProps={{ sx: { bgcolor: theme.palette.primary.dark } }}
      sx={{ bgcolor: "rgba(0,0,0,0.9)" }}
    >
      <Box
        sx={{
          width: "600px",
          bgcolor: theme.palette.primary.dark,
          maxHeight: "100%",
          position: "relative",
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            bgcolor: theme.palette.primary.dark,
            p: 2,
            mb: 2,
            zIndex: 2,
            position: "sticky",
            top: 0,
            boxShadow: 1,
          }}
        >
          {user ? "Update" : "Create"} subscriber
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <Box sx={{ p: 2, pt: 0 }}>
            {fields.map((field) => (
              <Box key={field.name} sx={{ mb: 2 }}>
                <TextField
                  inputProps={{
                    sx: field.multiline
                      ? { fontFamily: "monospace" }
                      : undefined,
                  }}
                  name={field.name}
                  label={field.label}
                  error={Boolean(formErrors[field.name])}
                  color="primary"
                  variant="filled"
                  autoComplete="off"
                  autoFocus={field.autoFocus}
                  value={field.value || ""}
                  fullWidth
                  rows={field.multiline ? 10 : 1}
                  multiline={field.multiline}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
                {field.description}
              </Box>
            ))}
          </Box>
          {hasFormError && (
            <Alert color="error" sx={{ mx: 2, mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              <Typography>
                {Object.keys(formErrors).map((key) => (
                  <span key={key}>{formErrors[key]}</span>
                ))}
              </Typography>
            </Alert>
          )}
          <Box
            sx={{
              textAlign: "right",
              position: "sticky",
              bottom: 0,
              bgcolor: theme.palette.primary.dark,
              borderTop: "1px solid rgba(0,0,0,0.5)",
              p: 2,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              loading={isLoading}
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
