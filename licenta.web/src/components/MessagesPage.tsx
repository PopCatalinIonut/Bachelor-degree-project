import { Grid } from "@material-ui/core";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { getUserMessages, messagesSelector } from "../features/MessageSlice";
import { LoggedUserDetails } from "../features/types";

export interface MessagesPageProps{
    user: LoggedUserDetails
}

export default function MessagesPage(props: MessagesPageProps){

    const dispatch = useAppDispatch();
    let messages = useAppSelector(messagesSelector);

    useEffect(() => {
        fetchMessages()
    },[]);

    const fetchMessages = async () =>{
        const response = await dispatch(getUserMessages(props.user.id))
        console.log(response);
        messages = response.payload
    }
    return (
        <div>
            <Grid container>
                <Grid item xs={3}>

                </Grid>

                <Grid item xs={9}>

                </Grid>
            </Grid>
        </div>
    )
}