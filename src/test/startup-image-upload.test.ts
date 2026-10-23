import { describe, it, expect } from "vitest";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function validateImageFile(file: { name: string; type: string; size: number }) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isSupportedType =
    ALLOWED_IMAGE_TYPES.includes(file.type) || ALLOWED_IMAGE_EXTS.includes(ext);
  if (!isSupportedType) {
    return {
      valid: false,
      error: "Please choose a supported image format (JPG, JPEG, PNG, or WEBP)",
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: "Image must be under 5 MB" };
  }
  const cleanExt = ALLOWED_IMAGE_EXTS.includes(ext) ? ext : "png";
  const contentType = file.type || `image/${cleanExt === "jpg" ? "jpeg" : cleanExt}`;
  return { valid: true, cleanExt, contentType };
}

describe("Startup image upload validation", () => {
  it("accepts valid JPG, JPEG, PNG, and WEBP files", () => {
    expect(validateImageFile({ name: "logo.jpg", type: "image/jpeg", size: 1024 * 50 }).valid).toBe(
      true,
    );
    expect(
      validateImageFile({ name: "logo.jpeg", type: "image/jpeg", size: 1024 * 100 }).valid,
    ).toBe(true);
    expect(validateImageFile({ name: "logo.png", type: "image/png", size: 1024 * 200 }).valid).toBe(
      true,
    );
    expect(
      validateImageFile({ name: "logo.webp", type: "image/webp", size: 1024 * 150 }).valid,
    ).toBe(true);
  });

  it("accepts files with uppercase extensions", () => {
    const res = validateImageFile({
      name: "COMPANY_LOGO.PNG",
      type: "image/png",
      size: 1024 * 100,
    });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.cleanExt).toBe("png");
      expect(res.contentType).toBe("image/png");
    }
  });

  it("accepts files where browser mime-type might be empty but extension is valid", () => {
    const res = validateImageFile({ name: "image.webp", type: "", size: 1024 * 80 });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.cleanExt).toBe("webp");
      expect(res.contentType).toBe("image/webp");
    }
  });

  it("rejects unsupported file formats like pdf, svg, gif or exe", () => {
    expect(validateImageFile({ name: "doc.pdf", type: "application/pdf", size: 1024 }).valid).toBe(
      false,
    );
    expect(validateImageFile({ name: "vector.svg", type: "image/svg+xml", size: 1024 }).valid).toBe(
      false,
    );
    expect(validateImageFile({ name: "anim.gif", type: "image/gif", size: 1024 }).valid).toBe(
      false,
    );
    expect(
      validateImageFile({ name: "virus.exe", type: "application/x-msdownload", size: 1024 }).valid,
    ).toBe(false);
  });

  it("rejects files larger than 5 MB", () => {
    const res = validateImageFile({ name: "huge.jpg", type: "image/jpeg", size: 6 * 1024 * 1024 });
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Image must be under 5 MB");
  });
});
