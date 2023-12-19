export default function elementFromHtmlString(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
export function elementFromHtmlStringWithMultipleChildren(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.childNodes;
}
