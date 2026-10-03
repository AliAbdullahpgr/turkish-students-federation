import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FormField } from "@/components/admin/AdminUi";

describe("admin FormField", () => {
  it("ties the label to a native input so it has an accessible name", () => {
    const html = renderToStaticMarkup(
      <FormField label="Birim adı">
        <input name="name" />
      </FormField>,
    );
    const labelFor = /<label[^>]*for="([^"]+)"/.exec(html)?.[1];
    const inputId = /<input[^>]*id="([^"]+)"/.exec(html)?.[1];
    expect(labelFor).toBeTruthy();
    expect(inputId).toBe(labelFor);
  });

  it("keeps an id the caller already set and leaves composite children alone", () => {
    const own = renderToStaticMarkup(
      <FormField label="A">
        <textarea id="mine" />
      </FormField>,
    );
    expect(own).toContain('for="mine"');
    expect(own).toContain('id="mine"');

    const Editor = () => <div data-editor />;
    const composite = renderToStaticMarkup(
      <FormField label="B">
        <Editor />
      </FormField>,
    );
    expect(composite).not.toContain("for=");
  });
});
