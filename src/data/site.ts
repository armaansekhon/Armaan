/**
 * Site-wide config.
 *
 * Contact + rating use FormSubmit.co — NO key, NO signup. The first submission
 * sends a one-time "Activate" email to `formSubmitId`; click it once and every
 * future submission lands in your inbox.
 *
 * Privacy tip: after activating, FormSubmit emails you a random alias like
 * "a1b2c3d4". Paste that into `formSubmitId` to keep your email out of the page.
 *
 */
export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export const site = {
  name: "Armaan Sekhon",
  role: "Software Developer",
  email: "armaansekhon6560@gmail.com",
  resumeUrl: "/resume.pdf",
  // FormSubmit alias — keeps the real email out of the page source.
  formSubmitId: "1fc54edea6a91ba54b8aa72bc4f77e88",
  socials: [
    { label: "LinkedIn",  href: "https://linkedin.com/in/armaan02", handle: "in/armaan02" },
    { label: "GitHub",    href: "https://github.com/armaansekhon",            handle: "@armaansekhon" },
    { label: "Instagram", href: "https://www.instagram.com/a_rmaan_sekhon_/", handle: "@a_rmaan_sekhon_" },
  ] satisfies SocialLink[],
} as const;

/** FormSubmit AJAX endpoint (returns JSON, no redirect). */
export const formSubmitUrl = `https://formsubmit.co/ajax/${site.formSubmitId}`;
