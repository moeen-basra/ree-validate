/**
 * Augment the typings of Vue.js
 */

import Vue, { ComponentOptions } from 'vue';
import { Validator, VeeValidateComponentOptions } from './ree-validate.d';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $_veeValidate?: VeeValidateComponentOptions;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $validator: Validator;
  }
}
