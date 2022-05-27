import { Box, Card, createStyles, Fab, Grid, TextField, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { getUserMessages, conversationsSelector, sendMessage, currentConversationSelector } from "../features/MessageSlice";
import { userSelector } from "../features/UserSlice";
import { DisplayMessage } from "./types";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import ButtonBase from '@mui/material/ButtonBase';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

const useStyles = makeStyles((theme: Theme) =>
({
    leftSide: {
        textAlign:"left",
        float:"left",
        marginBottom: "20px",
        marginLeft: "20px",
        backgroundColor: "rgb(200, 200, 200)",
        padding: "1em 1em",
        fontSize: "1em",
        borderRadius: "0 1.5rem 1.5rem 1.5rem",
        boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2)",
        filter: "drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1))",
        width: "fit-content",
        wordWrap:"break-word"
      },
      rightSide:{
        textAlign:"right",
        float:"right",
        marginRight: "20px",
        width: "fit-content",
        marginBottom: "20px",
        backgroundColor: "rgb(151, 178, 250)",
        padding: "1em 1em",
        fontSize: "1em",
        borderRadius: "1.5rem 0 1.5rem 1.5rem",
        boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2)",
        filter: "drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1))",
        wordWrap:"break-word"
      }
}));
export default function ChatPage(){
   
    const dispatch = useAppDispatch();
    const conversations = useAppSelector(conversationsSelector);
    let user = useAppSelector(userSelector);
    const [currentRecipient, setCurrentRecipient] = useState(0);
    const currentConversation = useAppSelector(currentConversationSelector(currentRecipient));
    const [message, setMessage] = useState("")
    let navigate = useNavigate(); 

    const classes = useStyles();
    useEffect(() => {
        fetchConversations()
    },[]);

    const recipientList = () =>{
        if(conversations !== undefined)
            return (<Grid item>
                { conversations.map((rec) => {
                return (<ButtonBase style={{width:"100%"}} onClick={() => {setCurrentRecipient(rec.recipient.id)}}>
                    <Grid container style={{borderBottom:"1px solid"}}>
                            <Grid item xs={6} style={{height:70, textAlign:"right",marginTop:"20px"}}>
                                <PersonIcon style={{width:"50px", height:"50px"}}/>
                            </Grid>
                            <Grid item xs={6} style={{textAlign:"left",marginTop:"20px",paddingLeft:"5px"}}>
                                <Typography>{rec.recipient.firstName}</Typography>
                                <Typography>{rec.recipient.lastName}</Typography>
                            </Grid></Grid>
                        </ButtonBase>)})}
                    </Grid>)  
    }

    const conversation = () =>{
        return (<Box style={{height:400, overflow: 'auto'}}><Grid container style={{boxSizing:"content-box"}}>
            { currentConversation?.messages.map((msg: DisplayMessage) =>{
            if(msg.sender.id !== user.id)
                return( <Grid item xs={12} >
                            <div className={classes.leftSide}>
                                <Typography style={{fontSize:"11px"}} variant="overline">{msg.date.toString()}</Typography>
                                <Typography style={{maxWidth:"660px",fontSize:"19px"}}>{msg.text}</Typography>
                            </div>
                        </Grid>)
            else 
                return( <Grid item xs={12}>
                            <div className={classes.rightSide}>
                                <Typography style={{fontSize:"11px"}} variant="overline">{msg.date.toString()}</Typography>
                                <Typography style={{maxWidth:"660px",fontSize:"19px"}}>{msg.text}</Typography>
                            </div>
                        </Grid>)
            })}
             </Grid></Box>)
    }

    const fetchConversations = async () =>{
        await dispatch(getUserMessages(user.id))
    }

    const handleSendMessage = async () =>{
        const response = await dispatch(sendMessage({senderId:user.id, receiverId: currentConversation?.recipient.id || 0, text: message}))
        let responseMessage = response.payload as DisplayMessage
        if(responseMessage != null)
            setMessage("")
       
    }
    return (
        <div style={{textAlign:"center",marginTop:"100px"}}>
             <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={() => {navigate('/home')}} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            <div style={{display:"flex",justifyContent:"center"}}>
                <Card style={{width:"1000px",marginBottom:"30px"}}>
                    <Grid container style={{border:"1px solid"}}>
                        <Grid item xs={3} style={{border:"1px solid"}}>
                            {recipientList()}
                        </Grid>
                        <Grid item xs={9}>
                            <Grid item style={{height:400}}>
                                {conversation()}
                            </Grid>
                        <Grid container style={{height:40, border:"1px solid"}}>
                            <Grid item xs={11}>
                                <TextField style={{width:"100%"}} value={message} 
                                    onChange={(event) => {setMessage(event.currentTarget.value)}}>
                                </TextField>
                            </Grid>
                            <Grid item xs={1} >
                                <Fab onClick={handleSendMessage} style={{width:40,height:20, float:"right"}} size="small">
                                    <SendIcon></SendIcon>
                                </Fab>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </div>
        </div>
    )
 
}
