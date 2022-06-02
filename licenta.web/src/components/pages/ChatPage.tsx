import { Box, Card, Input, Fab, Grid, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles"
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { getUserMessages, conversationsSelector, sendMessage, currentConversationSelector, chatHubConnection, addMessageToConversation, isMessageSliceInitialized } from "../../features/slices/MessageSlice";
import { userSelector } from "../../features/slices/UserSlice";
import { DisplayMessage, DisplayMessageResponse } from "../types";
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
        marginRight: "20px",
        backgroundColor: "rgb(200, 200, 200)",
        padding: "1em 1em",
        fontSize: "1em",
        borderRadius: "0 1.5rem 1.5rem 1.5rem",
        boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2)",
        filter: "drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1))",
        width: "fit-content",
        wordWrap:"break-word",
        maxWidth:"-webkit-fill-available"
      },
      rightSide:{
        textAlign:"right",
        float:"right",
        marginRight: "20px",
        marginLeft:"20px",
        width: "fit-content",
        marginBottom: "20px",
        backgroundColor: "rgb(151, 178, 250)",
        padding: "1em 1em",
        fontSize: "1em",
        borderRadius: "1.5rem 0 1.5rem 1.5rem",
        boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2)",
        filter: "drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1))",
        wordWrap:"break-word",
        maxWidth:"-webkit-fill-available"
      }
}));
export default function ChatPage(){
   
    const dispatch = useAppDispatch();
    const conversations = useAppSelector(conversationsSelector);
    let user = useAppSelector(userSelector);
    const [currentRecipient, setCurrentRecipient] = useState(0);
    const currentConversation = useAppSelector(currentConversationSelector(currentRecipient));
    const [message, setMessage] = useState("")

    const connection = useAppSelector(chatHubConnection);
    const isInitialized = useAppSelector(isMessageSliceInitialized);

    const classes = useStyles();
    useEffect(() => {
        if(isInitialized === false)
            fetchConversations()
        if(connection)
        connection.on('ReceiveMessage', (message: DisplayMessageResponse) => {
            dispatch(addMessageToConversation(message))
            scrollToBottom();
        });
    },[]);

    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        if(messagesEndRef.current !== null)
        messagesEndRef.current.scrollIntoView(true)
      }
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
                                <Typography style={{color:"black"}}>{rec.recipient.first_name}</Typography>
                                <Typography>{rec.recipient.last_name}</Typography>
                            </Grid></Grid>
                        </ButtonBase>)})}
                    </Grid>)  
    }

    const conversation = () =>{
        return (<Box style={{overflow: 'scroll',height:"inherit"}}><Grid container style={{boxSizing:"content-box"}}>
            { currentConversation?.messages.map((msg: DisplayMessage) =>{
            if(msg.sender.id !== user.id)
                return( <Grid item xs={12} style={{width:"inherit",maxWidth:"-webkit-fill-available"}}>
                            <div className={classes.leftSide}>
                                <Typography style={{fontSize:"10px"}} variant="overline">{msg.date.toString()}</Typography>
                                <Typography style={{maxWidth:"-webkit-fill-available",fontSize:"21px"}}>{msg.text}</Typography>
                            </div>
                        </Grid>)
            else 
                return( <Grid item xs={12} style={{width:"inherit",maxWidth:"-webkit-fill-available"}}>
                            <div className={classes.rightSide}>
                                <Typography style={{fontSize:"10px"}} variant="overline">{msg.date.toString()}</Typography>
                                <Typography style={{fontSize:"21px"}}>{msg.text}</Typography>
                            </div>
                        </Grid>)
            })
            }
            <div ref={messagesEndRef} style={{height:"30vh"}}></div>
             </Grid>
             </Box>)
    }

    const fetchConversations = async () =>{
        try{
            let connectionId = "";
            connection.start().then(x => console.log("connected"))
                            .then(() => getConnectionId() )
                            console.log(connectionId);
            
        }catch (err) {
            console.log(err)
        } 
    }
    const getConnectionId = () => {
        connection.invoke('getconnectionid')
        .then(async (data) => {
          await dispatch(getUserMessages({userId: user.id, connectionId: data}))
        });
        return "";
      }
    const handleSendMessage = async () =>{
        const response = await dispatch(sendMessage({senderId:user.id, receiverId: currentConversation?.recipient.id || 0, text: message}))
        let responseMessage = response.payload as DisplayMessage

        if(responseMessage != null) {
                scrollToBottom()
                setMessage("")
            }

    }
    return ( <div style={{textAlign:"center",display:"flex",justifyContent:"center",height:"94vh"}}>
                <Card style={{width:"1000px",marginBottom:"30px",height:"inherit"}}>
                    <Grid container style={{border:"1px solid",height:"inherit"}}>
                        <Grid item xs={3} style={{borderRight:"1px solid"}}>
                            {recipientList()}
                        </Grid>
                        <Grid item xs={9}>
                            <Grid item style={{height:"85vh"}}>
                                {conversation()}
                            </Grid>
                        <Grid container style={{height:55}}>
                            <Grid item xs={11}>
                                <Input style={{width:"100%",borderTop:"1px solid",height:60}} value={message}
                                    onChange={(event) => {setMessage(event.currentTarget.value)}}/>
                            </Grid>
                            <Grid item xs={1} style={{borderTop:"1px solid"}}>
                                <Fab onClick={handleSendMessage} style={{width:40,height:40, float:"right",marginRight:5,marginTop:5}} size="medium">
                                    <SendIcon></SendIcon>
                                </Fab>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </div>
    )
 
}
