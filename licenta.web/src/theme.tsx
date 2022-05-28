import { red } from '@mui/material/colors';
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
        variants:[{
            props: { size: 'large' },
            style: {
              padding:"5px 12px",
              minWidth:100
            },
          },]
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
            fontSize:"20px"
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
      MuiFab:{
        variants:[{
          props: { size: 'large' },
          style: {
            padding:"25px 10px",
            minWidth:130
          },
        },]
        
      },
      MuiInputLabel:{
        styleOverrides:{
          root:{
            color:"black",
            fontSize:17,
          }
        }
      },
     MuiOutlinedInput:{
       styleOverrides:{
         "notchedOutline":{
           border:"2px solid",
           borderRadius:"1.5rem 1.5rem 1.5rem 1.5rem",
         }
       }
     },
    }
    }
  );

export default theme;