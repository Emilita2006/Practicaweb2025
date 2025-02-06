export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Gestion de Permisos Gad Palenque",
  description: "Control de Gestion de Permisos Area de Talento Humano de los empleados del gad de Palenque ",
  navItems: [
    {
      label: "Inicio",
      href: "/inicio",
    },
    {
      label: "Permisos",
      href: "/solicitud_permisos",
    },
  ],
  navMenuItems: [],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
