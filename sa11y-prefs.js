// Base container.
// Checks will start at this DOM element.
const sa11yCheckRoot = "main";

// jQuery selectors to filter from default queries.
// E.g., to ignore images in a social media feed, add
// ".my-feed-container img" to imageIgnore.
const sa11yImageIgnore = ".block-ps-social img, [aria-hidden] img, [aria-hidden], [role='presentation']";
const sa11yHeaderIgnore = ".block-ps-social *";
const sa11yLinkIgnore = ".sa11y-exclude, .block-ps-social a";
const sa11yLinkTextIgnore = "span.sr-only"; // Ignore injected text for screen readers.
const sa11yFormsIgnore = "";
const sa11yFullCheckIgnore = ".block-ps-social *, #sa11y-container a, .sa11y-exclude";
const sa11yListIgnore = ".block-ps-social p";
const sa11yTableIgnore = "";
