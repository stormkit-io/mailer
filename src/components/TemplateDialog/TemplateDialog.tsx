import { FormEventHandler, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/lab/LoadingButton";
import { useTheme } from "@mui/material/styles";
import { fetcher } from "~/utils";

interface Props {
  open: boolean;
  template?: Template;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultHtml = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    This is a {{ it.variable }}, and this is {{ it.anotherVariable }}.
  </body>
</html>`;

const errors: Record<string, string> = {
  name: "Template name is a required field.",
  html: "Template content is a required field.",
  generic: "Something went wrong while submitting the form.",
};

export default function TemplateDialog({
  open,
  template,
  onClose,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [templateName, setTemplateName] = useState(template?.name);
  const [templateDesc, setTemplateDesc] = useState(template?.description);
  const [templateSubj, setTemplateSubj] = useState(template?.defaultSubject);
  const [templateHtml, setTemplateHtml] = useState(
    template?.html || defaultHtml
  );

  useEffect(() => {
    setTemplateName(template?.name);
    setTemplateDesc(template?.description);
    setTemplateSubj(template?.defaultSubject);
    setTemplateHtml(template?.html || defaultHtml);
  }, [template]);

  const fields = [
    {
      label: "Template name",
      name: "name",
      value: templateName,
      onChange: setTemplateName,
    },
    {
      label: "Template description",
      name: "desc",
      value: templateDesc,
      onChange: setTemplateDesc,
    },
    {
      label: "Template default subject",
      name: "defaultSubject",
      value: templateSubj,
      onChange: setTemplateSubj,
    },
    {
      label: "Template content",
      name: "html",
      value: templateHtml,
      onChange: setTemplateHtml,
      multiline: true,
      description: (
        <Box sx={{ mt: 1, color: "white", opacity: 0.75, fontSize: 14 }}>
          Consult the{" "}
          <Link
            sx={{ color: "white", textDecoration: "underline" }}
            href="https://squirrelly.js.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            documentation
          </Link>{" "}
          to understand better the templating engine.
        </Box>
      ),
    },
  ];

  const handleFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!templateName?.trim()) {
      errs.name = errors.name;
    }

    if (!templateHtml?.trim()) {
      errs.html = errors.html;
    }

    setFormErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    setIsLoading(true);

    fetcher("/api/template", {
      method: template ? "PATCH" : "POST",
      body: {
        recordId: template?.recordId,
        templateName: templateName?.trim(),
        templateHtml: templateHtml?.trim(),
        templateDesc: templateDesc?.trim(),
        templateSubject: templateSubj?.trim(),
      },
    })
      .then(() => {
        onSuccess();
      })
      .catch(() => {
        setFormErrors({ generic: errors.generic });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hasErrors = Object.keys(formErrors).length > 0;

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
          {template ? "Update" : "Create"} template
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
                  color="primary"
                  variant="filled"
                  autoComplete="off"
                  value={field.value || ""}
                  fullWidth
                  rows={field.multiline ? 20 : 1}
                  multiline={field.multiline}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
                {field.description}
              </Box>
            ))}
          </Box>
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
