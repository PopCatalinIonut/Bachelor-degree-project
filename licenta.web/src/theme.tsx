
import { purple,red } from '@mui/material/colors';
import { createTheme } from '@mui/material';
const theme = createTheme ({
    palette: {
    primary: {
      main: "rgb(102,0,204)",
    },
    secondary:{
      main: red[500]
    }
  },
    components:{
      MuiButton: {
          styleOverrides:{
            root:{
              
            },
            }
        }
      ,
      MuiToggleButton:{
        styleOverrides:{
          root:{
            border:"1.5px solid",
            borderRadius: "1.5rem 1.5rem 1.5rem 1.5rem",
            padding:"10px 10px 10px 10px",
            color:"black",
          },
        }
      },
      MuiTypography:{
        styleOverrides:{
          root:{
            fontFamily: "inherit",
            fontSize:"19px"
          }
        }
      },
      MuiSelect:{
        styleOverrides:{
          select:{
            padding:"4px 12px"
          }
        }
      },
      MuiMenuItem:{
        styleOverrides:{
          root:{
            height:"30px"
          }
        }
      },
    }
    }
  );

export default theme;