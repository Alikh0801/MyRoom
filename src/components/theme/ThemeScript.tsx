import { THEME_STORAGE_KEY } from "@/lib/theme";

const themeScript = `(function () {
  try {
    var k = ${JSON.stringify(THEME_STORAGE_KEY)};
    var t = localStorage.getItem(k);
    var dark = t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  } catch (e) {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
