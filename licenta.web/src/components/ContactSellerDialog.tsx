import { Fab, Grid, Paper, TextField, Typography, Snackbar } from "@mui/material";
import { DisplayMessage, PostUserDetails } from "./types";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { sendMessage } from "../features/MessageSlice";
export interface ContactSellerDialogProps{
    seller: PostUserDetails;
    userId: number;
    dialogClose: () => void;
}

export default function ContactSellerDialog(props: ContactSellerDialogProps){

    const dispatch = useAppDispatch()
    const [message, setMessage] = useState("")
    const [snackOpened,setSnackOpened] = useState(false);
    const handleSendMessage = async () =>{
        const response = await dispatch(sendMessage({senderId:props.userId, receiverId: props.seller.id, text: message}))
        let responseMessage = response.payload as DisplayMessage
        console.log(responseMessage)
        setSnackOpened(true)
        
        setTimeout( () => {  props.dialogClose(); },2000)
       
    }
    return (
        <div style={{width:400,height:200}}>
            <Grid container>
                <Grid item xs={9} >
                    <Paper style={{width:300, height:200}}>
                        <TextField multiline rows={7} style={{width:300}} variant="filled"
                            onBlur={(event) => {setMessage(event.currentTarget.value)}}>
                        </TextField>
                    </Paper>
                </Grid>
                <Grid item xs={3} style={{height:200, width:100}}>
                <div style={{marginLeft:25}}>
                    <Fab onClick={handleSendMessage} size="medium">
                        <SendIcon></SendIcon>
                    </Fab>
                </div>
                <div style={{marginTop:40, textAlign:"center"}}>
                    <Typography> To: </Typography>
                    <Typography>{props.seller.firstName + " " + props.seller.lastName}</Typography>
                </div>
                </Grid>
            </Grid>
            <Snackbar
                open={snackOpened} autoHideDuration={2000} message="Message sent!"
                anchorOrigin={{vertical: "top", horizontal: "center"}}/>
            </div>
    )
}