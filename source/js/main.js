import {ieFix} from './utils/ie-fix';
import {iosVhFix} from './utils/ios-vh-fix';

import {initModals} from './modules/init-modals';
import {initIE11} from './modules/initIE11';
import {initSlider} from './modules/slider';
import {initShare} from './modules/socials-share';

import {initFilter} from './modules/initFilter';
import {initScrollAnim} from './modules/scrollAnim';

// Utils
// ---------------------------------

ieFix();
iosVhFix();

// Modules
// ---------------------------------

initModals();
initIE11();
initSlider();
initShare();

initFilter();
initScrollAnim();
