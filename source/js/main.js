import {ieFix} from './utils/ie-fix';
import {iosVhFix} from './utils/ios-vh-fix';

import {initModals} from './modules/init-modals';
import {hidePreloader} from './modules/preloader';
import {initFilter} from './modules/filter';
import {initSlider} from './modules/slider';

// Utils
// ---------------------------------

ieFix();
iosVhFix();

// Modules
// ---------------------------------

initModals();
hidePreloader();
initFilter();
initSlider();
