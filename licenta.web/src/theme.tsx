import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material';

const theme = createTheme ({
    palette: {
    primary: {
      main: "rgb(102,0,204)",
    },
    secondary:{
      main: red[500]
    },
    background: {default:"#f5f5f5",paper:"#f5f5f5"}
  },
    components:{
      MuiButton: {
        variants:[{
            props: { size: 'large' },
            style: {
              padding:"5px 12px",
              minWidth:100
            }
          },
          {props: { size: 'medium' },
          style: {
            padding:"5px 12px",
            width:"fit-content"
          }}]
        }
      ,
      MuiToggleButton:{
        styleOverrides:{
          root:{
            border:"2px solid",
            padding:"5px 10px 5px 10px",
            color:"black",
          },
        }
      },
      MuiTypography:{
        styleOverrides:{
          root:{
            fontFamily: "inherit",
            fontSize:"17px"
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
            paddingBottom: 20
          }
        }
      },
     MuiOutlinedInput:{
       styleOverrides:{
         "notchedOutline":{
           border:"2px solid",
         },
       }
     },
     MuiChip:{
       styleOverrides:{
         label:{
          padding:"0px 5px"
         }
       }
     }
    }
    }
  );

export default theme;