export default function template(templateString) {
  const template = document.createElement('template');
  template.innerHTML = templateString;

  return template.content.cloneNode(true);
}
