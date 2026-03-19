import DOMPurify from "isomorphic-dompurify";

export const DOMPurifyPolyfill = {
  sanitize(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "ul", "ol", "li", "p", "br"],
      ALLOWED_ATTR: ["href", "target", "rel"],
      ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_TAGS: ["script", "style"],
      FORBID_ATTR: ["onerror", "onclick", "onload", "style"],
    });
  }
};
