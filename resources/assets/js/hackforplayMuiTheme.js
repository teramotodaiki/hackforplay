import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {
  purpleA200, pinkA200,
  grey600, pinkA400, pinkA100,
} from 'material-ui/styles/colors';

export default getMuiTheme({
  palette: {
    primary1Color: purpleA200,
    primary2Color: purpleA200,
    primary3Color: grey600,
    accent1Color: pinkA200,
    accent2Color: pinkA400,
    accent3Color: pinkA100,
  },
});
