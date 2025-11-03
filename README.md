# FabLabs Documentation

[![GitHub Page](https://img.shields.io/badge/Documentation-100000?style=for-the-badge&logo=github&logoColor=white)](https://sainsburywellcomecentre.github.io/fablabs-documentation/)

This repository contains the official documentation for the FabLabs at the Sainsbury Wellcome Centre.

> **Note:** The following README context is for the development. If you would like to see the actual content of the FabLabs documentation, please refer to [the documentation page](https://sainsburywellcomecentre.github.io/fablabs-documentation/).

## Getting Started

This website is deployed using [GitHub Pages](https://pages.github.com/). No additional build tools are required as this is a static site.
To get started with local development, you can simply clone the repository and open the `index.html` file in your web browser.

```bash
git clone https://github.com/sainsburywellcomecentre/fablabs-documentation.git
cd fablabs-documentation
open index.html
```

## Dependencies

- **GitHub REST API**: The website uses [GitHub REST API](https://docs.github.com/en/rest) to fetch the content of the documentation from the repositories that have been tagged with the `swc-fablabs` topic.
- **npm-marked**: The content is then rendered with [marked](https://github.com/markedjs/marked).
- **Altium Embedded Viewer**: For rendering Altium files, the [Altium Embedded Viewer](https://www.altium.com/altium-designer/embedded-viewer) is used.

## Add custom content

To add custom content to the documentation, you can create a `custom.json` file in the root of the repository. This file should contain an object with the following structure:

```json
{
  "repo-name": {
    "before": "<hr><h2>Introduction</h2><p>This is a custom introduction added before the README content.</p>",
    "after": "<hr><h2>Introduction</h2><p>This is a custom introduction added after the README content.</p>"
  }
}
```

## Layout

### Main Page

```bash
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [SWC Logo]        FabLabs Documentation        [theme toggle]     │
│                                                                    │
│                                                                    │
│                       [  Search bar  ]                             │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  repo-name       │  │  repo-name       │  │  repo-name       │  │
│  │  description     │  │  description     │  │  description     │  │
│  │  language • date │  │  language • date │  │  language • date │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  repo-name       │  │  repo-name       │  │  repo-name       │  │
│  │  description     │  │  description     │  │  description     │  │
│  │  language • date │  │  language • date │  │  language • date │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Subpage

```bash
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [Back]  repository-name                      [Link-to-GitHub]     │
│                                                                    │
│  Latest Release: version [link]               [Jump to PCB Viewer] │
│                                                                    │
│     ┌────────────────────────────────────────────────────────┐     │
│     │    README.md                                           │     │
│     │                                                        │     │
│     │                                                        │     │
│     │                                                        │     │
│     └────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ────────────────────────────── PCB Viewer ───────────────────     │
│                                                                    │
│           [ PCB 1 ]  [ PCB 2 ]  [ Schematic ]                      │
│                                                                    │
│     ┌────────────────────────────────────────────────────────┐     │
│     │   Embedded Viewer                                      │     │
│     │                                                        │     │
│     │                                                        │     │
│     │                                                        │     │
│     │                                                        │     │
│     └────────────────────────────────────────────────────────┘     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Roadmap

- [x] Add colour theme toggle
- [x] Add release version display
- [ ] Add Changelog
- [ ] Add back to top links
- [ ] Add KiCAD embedded viewer support

See the [open issues](https://github.com/sainsburywellcomecentre/fablabs-documentation/issues) for a full list of proposed features (and known issues).

## 📜 License

**Sainsbury Wellcome Centre code, firmware, and software is released under the [BSD 3-Clause License](https://opensource.org/license/bsd-3-clause).**

> For the full legal text, see [LICENSE](LICENSE).

## 📧 Contact

- **Author**: [@DCisHurt](https://github.com/DCisHurt)
- **Email**: [yuhsuan.chen@ucl.ac.uk](mailto:yuhsuan.chen@ucl.ac.uk)

## ❤ Contributors

 <a href = "https://github.com/sainsburywellcomecentre/fablabs-documentation/graphs/contributors">
   <img src = "https://contrib.rocks/image?repo=sainsburywellcomecentre/fablabs-documentation" alt="Contributors"/>
 </a>
