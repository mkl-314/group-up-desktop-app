const plugins = [
  ["umi-plugin-react"],
  [
    "umi-plugin-antd-theme",
    {
      theme: [
        {
          fileName: "theme1.css",
          key: "theme1",
          modifyVars: {
            "@primary-color": "#13C2C2",
            "@menu-dark-color": "#324444",
            "@menu-dark-bg": "#5A5A5A",
          },
        },
        {
          fileName: "theme2.css",
          key: "theme2",
          modifyVars: {
            "@primary-color": "#4992BF",
            "@menu-dark-color": "#9B9B9B",
            "@menu-dark-bg": "#3A3A3A",
          },
        },
      ],

      min: true,
      // css module
      isModule: true,

      ignoreAntd: false,

      ignoreProLayout: false,

      cache: true,
    },
  ],
];
