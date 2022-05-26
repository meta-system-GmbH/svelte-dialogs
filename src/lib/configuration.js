import * as svelteTransitions from "svelte/transition";
import { defaultDialogConfigOptions } from "./defaults";

let customConfig = {};

export const config = (options) => {
  customConfig = options;
};

export const getOpts = (type, options = {}) => {
  const defaults = defaultDialogConfigOptions[type];
  const custom = customConfig[type] ?? {};
  const customGlobal = customConfig.global ?? {};

  const props = {
    ...defaults.props,
    ...customGlobal.props,
    ...custom.props,
    ...options.props,
  };

  const transitions = resolveTransitions({
    ...defaults.transitions,
    ...customGlobal.transitions,
    ...custom.transitions,
    ...options.transitions,
  });

  return {
    ...defaults,
    ...customGlobal,
    ...custom,
    ...options,
    props,
    transitions,
  };
};

export const getModalOptions = (options) => getOpts("global", options);

export const getAlertOptions = (options) => getOpts("alert", options);

export const getConfirmOptions = (options) => getOpts("confirm", options);

export const getErrorOptions = (options) => getOpts("error", options);

export const getSuccessOptions = (options) => getOpts("success", options);

export const getWarningOptions = (options) => getOpts("warning", options);

export const getPromptOptions = (inputs, options) => {
  const opts = getOpts("prompt", options);

  const defaltInput = {
    component: opts.inputComponent,
    props: opts.inputProps || {
      label: "",
      formElementClass: opts.formElementClass,
      inputLabelClass: opts.inputLabelClass,
      inputClass: opts.inputClass,
    },
  };

  opts.props.inputs = inputs.map((input) => ({
    ...defaltInput,
    ...input,
  }));

  return opts;
};

/**
 * It modifies the transition in the configuration object if is a string,
 * and that's ok: if so it needs to resolves only the first time
 */
export const resolveTransitions = (transitions) => {
  for (const key in transitions) {
    const point = transitions[key];
    if (point && typeof point.transition === "string") {
      const transition = svelteTransitions[transition];
      if (!transition) throw new Error(`${point.transition} not an existing svelte transition`);
      point.transition = transition;
    }
  }
  return transitions;
};
