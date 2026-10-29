export type SocialIconName = 'x' | 'instagram' | 'linkedin' | 'github' | 'email' | 'rss';

export type Social = { icon: SocialIconName; label: string; href: string };

// The order here is the order they show up everywhere on the site.
export const SOCIALS: readonly Social[] = [
  { icon: 'x', label: 'x', href: 'https://x.com/joaoac_dev' },
  { icon: 'instagram', label: 'instagram', href: 'https://instagram.com/joaoac_dev' },
  { icon: 'linkedin', label: 'linkedin', href: 'https://linkedin.com/in/joaoac' },
  { icon: 'github', label: 'github', href: 'https://github.com/joaoantoniocoelho' },
];
