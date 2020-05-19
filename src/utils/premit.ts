import sysPremits from './sysPremits';

export interface PremitItem {
  premit_id: string;
  premit_module: string;
  premit_module_desc: string;
  premit_action: string;
  premit_action_desc: string;
  premit_type: string;
}

export function getPremits() {
  let premits: PremitItem[] = [];
  let i = 1;
  for (let { module_name, module_desc, module_type, actions } of sysPremits) {
    for (let act in actions) {
      premits.push({
        premit_id: `${i}`,
        premit_module: module_name,
        premit_module_desc: module_desc,
        premit_action: act,
        premit_action_desc: actions[act] as string,
        premit_type: module_type,
      });
      i++;
    }
  }
  return { premits, i };
}

export function getMenu() {
  let premits: PremitItem[] = getPremits();
}

export default sysPremits;
