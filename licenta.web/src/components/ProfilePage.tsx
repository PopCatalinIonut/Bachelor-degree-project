import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Fab, Grid, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";
import { useAppSelector } from "../app/hooks";
import { LoggedUserDetails } from "../features/UserSlice/types";
import { userSelector } from "../features/UserSlice/UserSlice";
const styles = {
    typographyFormat: {
        padding: "10px 20px",
        fontSize: "22px",
        float:"left"
    }as React.CSSProperties
  }
export default function ProfilePage() {

    let navigate = useNavigate(); 
    const handleGoHome = () =>{ 
      navigate("/home")
    }
  
    const currentUser: LoggedUserDetails | null = useAppSelector(userSelector);
    
    return (
        <div style={{textAlign:"center"}}>
            <div style={{textAlign:"center",marginTop: "100px",marginBottom:"20px"}}>
            <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            
            <Card style={{display: "inline-grid",width:"500px"}} variant="outlined">
                <CardContent>
                    <div style={{display:"inline-block"}}>   
                        <Grid container >
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat} noWrap>First name: </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>{currentUser?.firstName} </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat} noWrap>Last name: </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>{currentUser?.lastName}</Typography>
                            </Grid>
                            <Grid item sm={6} >
                                <Typography style={styles.typographyFormat}>Email:</Typography>
                            </Grid>
                            <Grid item sm={6} >
                                <Typography style={styles.typographyFormat}>{currentUser?.email}</Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Username:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>{currentUser?.loginUsername} </Typography>
                            </Grid>
                        </Grid>
                        <Accordion style={{marginTop:"30px",marginBottom:"30px"}}>
                            <AccordionSummary  expandIcon={<ExpandMoreIcon />}  >
                                <Typography>Your active selling items</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
                                <Typography>Your disabled items</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                
                            </AccordionDetails>
                        </Accordion>
                  </div>
              </CardContent>
          </Card>
      </div>
    );
  
  }