export function createLayerPropertyInput(label: string, value: string): HTMLLabelElement {
  const wrap = document.createElement('label');
  wrap.className = 'layer-property';
  wrap.textContent = label;

  const input = document.createElement('input');
  input.value = value;
  wrap.append(input);
  return wrap;
}
