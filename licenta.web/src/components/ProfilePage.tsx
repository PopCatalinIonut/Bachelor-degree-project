import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, Fab, Grid, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";
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
  
    let user = "user";
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
                                <Typography style={styles.typographyFormat}>name </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat} noWrap>Last name: </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>lastname </Typography>
                            </Grid>
                            <Grid item sm={6} >
                                <Typography style={styles.typographyFormat}>Email:</Typography>
                            </Grid>
                            <Grid item sm={6} >
                                <Typography style={styles.typographyFormat}>email </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Username:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>username </Typography>
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