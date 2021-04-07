import {ieFix} from './utils/ie-fix';
import {iosVhFix} from './utils/ios-vh-fix';

import {initModals} from './modules/init-modals';
// import {hidePreloader} from './modules/preloader';
//import {initFilterState} from './modules/filter-state';
import {initSlider} from './modules/slider';

// Utils
// ---------------------------------

ieFix();
iosVhFix();

// Modules
// ---------------------------------

initModals();
// hidePreloader();
//initFilterState();
initSlider();


