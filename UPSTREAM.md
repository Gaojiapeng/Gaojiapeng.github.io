# Theme provenance

This website uses source files from [AcademicPages](https://github.com/academicpages/academicpages.github.io), an academic website template based on Minimal Mistakes.

- Upstream repository: `https://github.com/academicpages/academicpages.github.io`
- Upstream commit: [`c77da751a8124450d5fb818056c0cf081fea08e1`](https://github.com/academicpages/academicpages.github.io/commit/c77da751a8124450d5fb818056c0cf081fea08e1)
- License: MIT; the upstream `LICENSE` is retained.

The theme’s `assets/css/main.scss` and `_sass/` source files are unchanged from that commit. The site retains AcademicPages’ academic layout, author sidebar, navigation, and typography, with small personal adjustments in `assets/css/custom.css`.

## Local adaptations

- Replaced sample content and configuration with Jiapeng Gao’s biography, research, publications, CV downloads, portrait, and GitHub profile.
- Added a pull-to-unlock Gallery entrance at the homepage’s native bottom. Sustained downward input pulls against resistance to uncover Jiapeng’s credited Milky Way photograph beneath the page and unlock the Gallery; a pause or reverse input retracts it. A fixed, initially hidden backdrop replaces an extended scroll track. The visible down-arrow cue includes a direct Gallery link that also works without JavaScript.
- Added an Apple-inspired Gallery layout, photography markup, and isolated gallery CSS and JavaScript.
- Integrated the supplied ExoplanetML final report and its linked proposal, midterm report, and figures under `projects/exoplanetml/`, with homepage links, return navigation, and responsive styling.
- Used flat `.html` permalinks and set `_includes/base_path` to `.` so generated pages and assets work in a local folder as well as on a web server.
- Simplified the Jekyll dependencies and disabled unused plugins. The included lockfile was validated with Ruby 2.6.10 and Jekyll 3.9.5.

Personal research content comes from the supplied CVs and research materials. Numerical GJ 436b constraints come from the supplied research figure. Photography is credited to Jiapeng Gao; capture metadata and its sources are recorded in `assets/astro/manifest.json`.

The configured `Gaojiapeng.github.io` address is the intended host. This local customization has not been publicly deployed.
